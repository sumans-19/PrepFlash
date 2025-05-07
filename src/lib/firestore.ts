
import { 
    doc, collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, 
    query, where, orderBy, limit, Timestamp, arrayUnion, arrayRemove, serverTimestamp 
  } from "firebase/firestore";
  import { db } from "./firebase";
  import { StudyGroup, ForumPost, DailyChallenge, User } from "@/types/models";
  
  // ========== Study Groups ==========
  export const createStudyGroup = async (studyGroup: Omit<StudyGroup, 'id' | 'createdAt'>) => {
    try {
      const docRef = await addDoc(collection(db, "studyGroups"), {
        ...studyGroup,
        members: [studyGroup.creatorId], // Add creator as first member
        createdAt: serverTimestamp()
      });
      
      // Also add the group to the user's joinedGroups
      await updateDoc(doc(db, "users", studyGroup.creatorId), {
        joinedGroups: arrayUnion(docRef.id)
      });
      
      return docRef.id;
    } catch (error) {
      console.error("Error creating study group:", error);
      throw error;
    }
  };
  
  export const getStudyGroup = async (id: string) => {
    try {
      const docSnap = await getDoc(doc(db, "studyGroups", id));
      if (docSnap.exists()) {
        const data = docSnap.data();
        return { 
          id: docSnap.id, 
          ...data,
          createdAt: data.createdAt?.toDate() || new Date() 
        } as StudyGroup;
      } else {
        throw new Error("Study group not found");
      }
    } catch (error) {
      console.error("Error getting study group:", error);
      throw error;
    }
  };
  
  export const getAllStudyGroups = async () => {
    try {
      const q = query(collection(db, "studyGroups"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date()
        } as StudyGroup;
      });
    } catch (error) {
      console.error("Error getting study groups:", error);
      throw error;
    }
  };
  
  export const joinStudyGroup = async (groupId: string, userId: string) => {
    try {
      const groupRef = doc(db, "studyGroups", groupId);
      const userRef = doc(db, "users", userId);
      
      // Add user to group members
      await updateDoc(groupRef, {
        members: arrayUnion(userId)
      });
      
      // Add group to user's joinedGroups
      await updateDoc(userRef, {
        joinedGroups: arrayUnion(groupId)
      });
      
      return true;
    } catch (error) {
      console.error("Error joining study group:", error);
      throw error;
    }
  };
  
  export const leaveStudyGroup = async (groupId: string, userId: string) => {
    try {
      const groupRef = doc(db, "studyGroups", groupId);
      const userRef = doc(db, "users", userId);
      
      // Remove user from group members
      await updateDoc(groupRef, {
        members: arrayRemove(userId)
      });
      
      // Remove group from user's joinedGroups
      await updateDoc(userRef, {
        joinedGroups: arrayRemove(groupId)
      });
      
      return true;
    } catch (error) {
      console.error("Error leaving study group:", error);
      throw error;
    }
  };
  
  // ========== Forum Posts ==========
  export const createForumPost = async (post: Omit<ForumPost, 'id' | 'createdAt' | 'comments' | 'likes'>) => {
    try {
      const docRef = await addDoc(collection(db, "forumPosts"), {
        ...post,
        likes: [],
        comments: [],
        createdAt: serverTimestamp()
      });
      
      return docRef.id;
    } catch (error) {
      console.error("Error creating forum post:", error);
      throw error;
    }
  };
  
  export const getForumPost = async (id: string) => {
    try {
      const docSnap = await getDoc(doc(db, "forumPosts", id));
      if (docSnap.exists()) {
        const data = docSnap.data();
        return { 
          id: docSnap.id, 
          ...data,
          createdAt: data.createdAt?.toDate() || new Date() 
        } as ForumPost;
      } else {
        throw new Error("Forum post not found");
      }
    } catch (error) {
      console.error("Error getting forum post:", error);
      throw error;
    }
  };
  

  
  export const likeForumPost = async (postId: string, userId: string) => {
    try {
      await updateDoc(doc(db, "forumPosts", postId), {
        likes: arrayUnion(userId)
      });
      return true;
    } catch (error) {
      console.error("Error liking forum post:", error);
      throw error;
    }
  };
  
  export const unlikeForumPost = async (postId: string, userId: string) => {
    try {
      await updateDoc(doc(db, "forumPosts", postId), {
        likes: arrayRemove(userId)
      });
      return true;
    } catch (error) {
      console.error("Error unliking forum post:", error);
      throw error;
    }
  };
  
  export const addCommentToPost = async (postId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => {
    try {
      const commentId = `comment-${Date.now()}`;
      const newComment = {
        id: commentId,
        ...comment,
        createdAt: new Date()
      };
      
      await updateDoc(doc(db, "forumPosts", postId), {
        comments: arrayUnion(newComment)
      });
      
      return commentId;
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  };
  
  // ========== Daily Challenges ==========
  export const getDailyChallenge = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const q = query(
        collection(db, "dailyChallenges"),
        where("date", ">=", today),
        orderBy("date", "asc"),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        return { 
          id: doc.id, 
          ...data,
          date: data.date?.toDate() || new Date() 
        } as DailyChallenge;
      }
      
      // If no challenge found for today, return default
      return {
        id: 'default',
        title: 'System Design Interview',
        description: 'Design a scalable notification system for a social media platform',
        type: 'system-design',
        date: new Date(),
        completedBy: []
      } as DailyChallenge;
    } catch (error) {
      console.error("Error getting daily challenge:", error);
      throw error;
    }
  };
  
  export const completeDailyChallenge = async (challengeId: string, userId: string) => {
    try {
      // Update the challenge with the user who completed it
      await updateDoc(doc(db, "dailyChallenges", challengeId), {
        completedBy: arrayUnion(userId)
      });
      
      // Update user's streak and points
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        await updateDoc(userRef, {
          streak: (userData.streak || 0) + 1,
          points: (userData.points || 0) + 50
        });
      }
      
      return true;
    } catch (error) {
      console.error("Error completing challenge:", error);
      throw error;
    }
  };
  
  // ========== User Data ==========
  export const getUserProfile = async (userId: string) => {
    try {
      const docSnap = await getDoc(doc(db, "users", userId));
      if (docSnap.exists()) {
        const data = docSnap.data();
        return { 
          id: docSnap.id, 
          ...data,
          createdAt: data.createdAt?.toDate() || new Date() 
        } as User;
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      console.error("Error getting user profile:", error);
      throw error;
    }
  };
  
  export const getLeaderboard = async (timeframe: string = 'week') => {
    try {
      // This would be more complex in a real app with date filtering
      const q = query(collection(db, "users"), orderBy("points", "desc"), limit(10));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date()
        } as User;
      });
    } catch (error) {
      console.error("Error getting leaderboard:", error);
      throw error;
    }
  };
  
  export const createUserIfNotExists = async (user: { id: string, email: string, name: string, avatar?: string }) => {
    try {
      const userRef = doc(db, "users", user.id);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await updateDoc(userRef, {
          email: user.email,
          name: user.name,
          avatar: user.avatar || '',
          points: 0,
          streak: 0,
          solved: 0,
          createdAt: serverTimestamp(),
          joinedGroups: [],
          achievements: []
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  };
  