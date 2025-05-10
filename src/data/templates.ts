import { Template } from '../types/index';

export const defaultTemplates: Template[] = [
    {
        id: "classic",
        name: "Classic",
        description: "Traditional format that works well for conservative industries",
        thumbnail: "classic.png",
        promptTemplate: `Hey Gemini! Generate a resume in professional HTML format suitable for traditional sectors like banking or law.
- Font: Poppins
- Font color: #2D2D2D, Section headings in #5BBEEE
- Layout: two-column (left: Skills; right: Profile, Experience, Education)
- Header: Centered Name (bold), Role beneath it, followed by Contact Info and Links
- Skills as vertically listed blue rounded badges
- Section titles in #5BBEEE with a thin underline
- Maintain whitespace, structure, and conservative elegance
- Output pure HTML with minimal embedded CSS only
- Ensure the layout is centered and designed to fit an A4 page when printed or viewed.
- Only include sections (like Projects, Certifications, etc.) if their data is available in the JSON — skip empty/null ones.
- Use this JSON:
{{resume_data}}
Respond only with valid HTML output. Do not include any explanations or extra text.`
    },
    {
        id: "modern-elegance",
        name: "Modern Elegance",
        description: "Stylish yet ATS-friendly layout with a modern professional vibe",
        thumbnail: "elegant.png",
        promptTemplate: `Hey Gemini! Create a sleek and modern resume in HTML format that suits creative professionals and consultants.
- Font: Poppins, fallback: sans-serif
- Font color: #333333, with headings in #5BBEEE and section subtitles in #707070
- Header: Centered Name in bold, Role in smaller text below, horizontal Contact Info
- Profile (20+ words) in a soft bordered box
- Skills as center-aligned blue pill badges, spaced evenly
- Experience and Education in a semi-timeline format
- Section headers with #5BBEEE color and a 2px border below
- Keep layout airy, attractive, and ATS-readable
- Return clean HTML with minimal embedded CSS only
- Ensure the layout is centered and designed to fit an A4 page when printed or viewed.
- Only include sections (like Projects, Certifications, etc.) if their data is available in the JSON — skip empty/null ones.
- Use this JSON:
{{resume_data}}
Respond only with valid HTML output. Do not include any explanations or extra text.`
    },
    {
        id: "creative-tech",
        name: "Creative Tech",
        description: "Designed for tech roles with a slight creative twist in layout and skill emphasis",
        thumbnail: "creative.png",
        promptTemplate: `Hey Gemini! Generate a modern HTML resume suitable for developers and tech professionals with a creative touch.
- Font: Poppins
- Font color: #1A1A1A, highlight color: #5BBEEE, subtitles in #555
- Header: Left-aligned bold Name, Role next to it, with Contact Info on the right
- Profile (20+ words) just below header in a light blue bordered box
- Skills as multi-column rounded blue badges (responsive layout)
- Experience/Education styled like cards with subtle shadow or lines
- Section headers bolded in #5BBEEE with a bottom border
- Prioritize content flow, visual balance, and scannability
- Return minimal clean HTML with light embedded CSS only
- Ensure the layout is centered and designed to fit an A4 page when printed or viewed.
- Only include sections (like Projects, Certifications, etc.) if their data is available in the JSON — skip empty/null ones.
- Use this JSON:
{{resume_data}}
Respond only with valid HTML output. Do not include any explanations or extra text.`
    },
    {
        id: "minimalist",
        name: "Minimalist",
        description: "Clean, white-space rich layout ideal for any modern industry",
        thumbnail: "minimal.png",
        promptTemplate: `Hey Gemini! Generate a whitespace-focused, ultra-minimal resume in HTML format.
- Font: Poppins, light weight preferred
- Font color: #444444; headings in #5BBEEE; muted gray (#888) for dates/roles
- Header: Centered Name, bold with clean Role text below
- Contact Info and Links stacked below
- Profile (20+ words) in full-width paragraph form
- Skills as simple spaced-out blue tags with rounded edges
- Experience and Education linear and tidy
- Section headers #5BBEEE with ultra-thin borders beneath
- Keep visuals minimal yet elegant, and 100% ATS-compliant
- Output plain HTML with minimal inline CSS only
- Ensure the layout is centered and designed to fit an A4 page when printed or viewed.
- Only include sections (like Projects, Certifications, etc.) if their data is available in the JSON — skip empty/null ones.
- Use this JSON:
{{resume_data}}
Respond only with valid HTML output. Do not include any explanations or extra text.`
    },
    {
        id: "bold-impact",
        name: "Bold Impact",
        description: "Attention-grabbing design with bold headers and structured sections",
        thumbnail: "bold.jpg",
        promptTemplate: `Hey Gemini! Generate a bold and modern resume in HTML designed to stand out at first glance.
- Font: Poppins Extra Bold for headers, Regular for body
- Font color: #111111; Section titles in #5BBEEE; skill badges in white text on #5BBEEE background
- Header: Very large centered Name, Role in uppercase below it, and Contact Info in horizontal pill format
- Profile (20+ words) with bold intro line and lighter subtext
- Skills as grid layout badges (responsive with spacing)
- Experience/Education in block layout with date right-aligned
- Section headers uppercase, #5BBEEE, with thick border below
- Make sure it's energetic, clean, and ATS-friendly
- Return pureHTML  with light embedded CSS only
- Ensure the layout is centered and designed to fit an A4 page when printed or viewed.
- Only include sections (like Projects, Certifications, etc.) if their data is available in the JSON — skip empty/null ones.
- Use this JSON:
{{resume_data}}
Respond only with valid HTML output. Do not include any explanations or extra text.`
    }
];