import Link from 'next/link'
import { Github, Twitter, Mail, Code2 } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Code2 className="h-6 w-6 text-primary" />
              <span className="font-inter font-bold text-xl">SQL Scribe</span>
            </Link>
            <p className="text-muted-foreground mt-2 text-sm">
              Speak to Your Database.<br />Let AI Handle the SQL.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:col-span-3">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/features">Features</Link></li>
                <li><Link href="/pricing">Pricing</Link></li>
                <li><Link href="/demo">Demo</Link></li>
                <li><Link href="/docs">Documentation</Link></li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/guides">Guides</Link></li>
                <li><Link href="/tutorials">Tutorials</Link></li>
                <li><Link href="/examples">Examples</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-sm">Connect</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="https://github.com" className="flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    <span>GitHub</span>
                  </Link>
                </li>
                <li>
                  <Link href="https://twitter.com" className="flex items-center gap-2">
                    <Twitter className="h-4 w-4" />
                    <span>Twitter</span>
                  </Link>
                </li>
                <li>
                  <Link href="mailto:hello@sqlscribe.ai" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>Contact</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center mt-8 pt-8 border-t text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} SQL Scribe. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/cookies">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}