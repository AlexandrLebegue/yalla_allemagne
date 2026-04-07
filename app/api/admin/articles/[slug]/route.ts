import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { isAuthenticated } from '@/lib/admin-auth';

const contentDirectory = path.join(process.cwd(), 'content');

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    const filePath = path.join(contentDirectory, `${slug}.md`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return NextResponse.json({
      slug,
      frontmatter: data,
      content,
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    const { frontmatter, content, newSlug } = await request.json();

    const filePath = path.join(contentDirectory, `${slug}.md`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
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

    // If slug is changing, rename the file
    if (newSlug && newSlug !== slug) {
      const safeNewSlug = newSlug
        .toLowerCase()
        .replace(/[^a-z0-9-_]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      const newFilePath = path.join(contentDirectory, `${safeNewSlug}.md`);

      // Check if new slug already exists
      if (fs.existsSync(newFilePath)) {
        return NextResponse.json({ error: 'Article with new slug already exists' }, { status: 409 });
      }

      // Delete old file
      fs.unlinkSync(filePath);
      // Write new file
      fs.writeFileSync(newFilePath, fileContent, 'utf8');

      return NextResponse.json({ success: true, slug: safeNewSlug });
    }

    // Update existing file
    fs.writeFileSync(filePath, fileContent, 'utf8');

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    const filePath = path.join(contentDirectory, `${slug}.md`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    fs.unlinkSync(filePath);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}
