import puppeteer from 'puppeteer';

// const itCompanies = {
//     tier1: [ "Microsoft", "Apple", "Google", "Amazon", "IBM", "Meta", "Facebook", "Oracle", "Salesforce", "SAP", "Intel", "Alphabet" ],
//     tier2: [ "Accenture", "TCS", "Tata Consultancy Services", "Infosys", "Capgemini", "Cognizant", "Wipro", "HCL", "HCL Technologies", "Deloitte", "NTT Data", "DXC Technology" ],
//     tier3: [ "Mindtree", "Tech Mahindra", "LTIMindtree", "Mphasis", "Hexaware", "Virtusa", "Persistent Systems", "Larsen & Toubro Infotech", "L&T Infotech", "Zensar", "Cyient" ],
//     tier4: [ "Zoho", "Freshworks", "Birlasoft", "NIIT Technologies", "Coforge", "Happiest Minds", "Sonata Software", "Sasken", "Newgen Software", "Kellton Tech" ]
// };

// Scraper function
export async function scrapeInternships(company = '', location = '') {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
  
    try {
      const searchTerm = company ? company : 'it sector';
      const url = `https://internshala.com/internships/keywords-${encodeURIComponent(searchTerm)}/`;
  
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('.individual_internship', { timeout: 10000 });
  
      const allInternships = await extractInternships(page);
  
      // Filter by location if provided
      const filtered = location
        ? allInternships.filter(intern =>
            intern.location.toLowerCase().includes(location.toLowerCase())
          )
        : allInternships;
  
      return filtered;
    } catch (err) {
      console.error("Scraping error:", err);
      return [];
    } finally {
      await browser.close();
    }
  }
  

// Reusable extract logic
async function extractInternships(page) {
    return await page.evaluate(() => {
        const cards = document.querySelectorAll('.individual_internship');
        return Array.from(cards).map(card => {
            const title = card.querySelector('.job-internship-name a')?.innerText.trim() || "No title";
            const company = card.querySelector('.company_name .company-name')?.innerText.trim() || "No company";
            const location = card.querySelector('.locations a')?.innerText.trim() || "No location";
            const stipend = card.querySelector('.stipend')?.innerText.trim() || "No stipend";
            const duration = card.querySelectorAll('.detail-row-1 .row-1-item')[1]
                ? card.querySelectorAll('.detail-row-1 .row-1-item')[1].querySelector('span')?.textContent.trim() || 'No duration'
                : 'No duration';
            const statusElement = card.querySelector('.status-success span, .status-inactive span, .status-info span');
            const postedAt = statusElement?.innerText.trim() || "No posted date";
            const applicationPath = card.querySelector('.job-title-href')?.getAttribute('href');
            const applicationUrl = applicationPath ? 'https://internshala.com' + applicationPath : "No application URL";

            return { title, company, location, stipend, duration, postedAt, applicationUrl };
        }).filter(intern => intern.title !== "No title" && intern.company !== "No company");
    });
}