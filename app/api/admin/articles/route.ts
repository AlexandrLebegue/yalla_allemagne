import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { isAuthenticated } from '@/lib/admin-auth';

const contentDirectory = path.join(process.cwd(), 'content');

// Ensure content directory exists
function ensureContentDirectory() {
  if (!fs.existsSync(contentDirectory)) {
    fs.mkdirSync(contentDirectory, { recursive: true });
  }
}

export async function GET() {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    ensureContentDirectory();

    const files = fs.readdirSync(contentDirectory).filter(f => f.endsWith('.md'));
    
    const articles = files.map(filename => {
      const slug = filename.replace(/\.md$/, '');
      const fullPath = path.join(contentDirectory, filename);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      
      const wordCount = content.split(/\s+/).length;
      const readingTime = Math.ceil(wordCount / 200);

      return {
        slug,
        title: data.title || slug,
        excerpt: data.excerpt || '',
        date: data.date || new Date().toISOString().split('T')[0],
        coverImage: data.coverImage || '',
        category: data.category || '',
        tags: data.tags || [],
        keywords: data.keywords || [],
        author: data.author || '',
        readingTime,
        wordCount,
      };
    });

    // Sort by date descending
    articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug, frontmatter, content } = await request.json();

    if (!slug || !frontmatter || content === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Sanitize slug
    const safeSlug = slug
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    if (!safeSlug) {
      return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
    }

    ensureContentDirectory();

    const filePath = path.join(contentDirectory, `${safeSlug}.md`);

    // Check if file already exists
    if (fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Article with this slug already exists' }, { status: 409 });
    }

    // Build frontmatter
    const fm = {
      title: frontmatter.title || 'Untitled',
      excerpt: frontmatter.excerpt || '',
      date: frontmatter.date || new Date().toISOString().split('T')[0],
      coverImage: frontmatter.coverImage || '',
      category: frontmatter.category || '',
      tags: frontmatter.tags || [],
      keywords: frontmatter.keywords || [],
      author: frontmatter.author || '',
    };

    // Create markdown file with frontmatter
    const fileContent = matter.stringify(content, fm);
    fs.writeFileSync(filePath, fileContent, 'utf8');

    return NextResponse.json({ success: true, slug: safeSlug });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}
