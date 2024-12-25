export class ContentCleaner {
    clean(html: string): string {
      if (!html){
        console.log('No html to clean');
        return '';
    }
      
      let cleaned = html;
      
      // Remove head section
      cleaned = cleaned.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '');
      
      // Remove scripts
      cleaned = cleaned.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
      
      // Remove styles
      cleaned = cleaned.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
      
      // Remove comments
      cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');
      
      // Remove HTML tags
      cleaned = cleaned.replace(/<[^>]+>/g, '');
      
      // Normalize whitespace
      cleaned = cleaned.replace(/\s+/g, ' ');
      
      // Remove empty lines
      cleaned = cleaned.replace(/^\s*[\r\n]/gm, '');
      
      return cleaned.trim();
    }
  }
  