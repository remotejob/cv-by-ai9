const fs = require('fs/promises');
const path = require('path');

const CONTENT_DIR = path.join(process.cwd(), 'content');
const PUBLIC_CONTENT_DIR = path.join(process.cwd(), 'public/content');

async function copyContent() {
  try {
    // Ensure public/content exists
    await fs.mkdir(PUBLIC_CONTENT_DIR, { recursive: true });

    // Copy knowledge content
    const knowledgeSrc = path.join(CONTENT_DIR, 'knowledge');
    const knowledgeDest = path.join(PUBLIC_CONTENT_DIR, 'knowledge');
    await fs.mkdir(knowledgeDest, { recursive: true });
    
    console.log('Copying knowledge content...');
    const knowledgeFiles = await fs.readdir(knowledgeSrc);
    for (const file of knowledgeFiles) {
      if (!file.endsWith('.json')) continue;
      
      const srcPath = path.join(knowledgeSrc, file);
      const destPath = path.join(knowledgeDest, file);
      
      // Validate JSON before copying
      const content = await fs.readFile(srcPath, 'utf-8');
      JSON.parse(content); // Will throw if invalid
      
      await fs.copyFile(srcPath, destPath);
      console.log(`✓ Copied ${file}`);
    }

    // Copy projects content
    const projectsSrc = path.join(CONTENT_DIR, 'projects');
    const projectsDest = path.join(PUBLIC_CONTENT_DIR, 'projects');
    await fs.mkdir(projectsDest, { recursive: true });
    
    console.log('\nCopying projects content...');
    const projectFiles = await fs.readdir(projectsSrc);
    for (const file of projectFiles) {
      if (!file.endsWith('.json')) continue;
      
      const srcPath = path.join(projectsSrc, file);
      const destPath = path.join(projectsDest, file);
      
      // Validate JSON before copying
      const content = await fs.readFile(srcPath, 'utf-8');
      JSON.parse(content); // Will throw if invalid
      
      await fs.copyFile(srcPath, destPath);
      console.log(`✓ Copied ${file}`);
    }

    console.log('\n✨ Content files copied successfully');
  } catch (error) {
    console.error('Error copying content:', error);
    process.exit(1);
  }
}

copyContent();