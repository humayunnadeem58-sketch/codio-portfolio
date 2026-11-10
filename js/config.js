/**
 * Personal Portfolio Configuration
 * 
 * Configured for CODIO - Website Developer
 */

export const siteConfig = {
  // Identity & Meta
  ownerName: "CODIO",
  ownerRole: "Website-Developer",
  
  // Destination email for inquiries (used in mailto fallback and direct contact links)
  // Replace with your real contact email when ready (e.g., hello@codio.dev)
  receiverEmail: "contact@codio.dev",

  // Form delivery endpoint URL.
  // Supported services: Formspree, FormSubmit, Web3Forms, Getform, or your custom server API.
  // Leave empty ("") if you haven't set up a provider yet — the form will automatically
  // provide an honest fallback allowing visitors to send via their email client or copy to clipboard.
  // Example: "https://formspree.io/f/my-form-id"
  contactEndpoint: "",

  // Social profile links (update with your real handles)
  socialLinks: {
    github: "https://github.com/[your-username]",
    linkedin: "https://linkedin.com/in/[your-username]",
    twitter: "https://x.com/[your-username]"
  }
};
