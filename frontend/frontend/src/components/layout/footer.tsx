'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <span className="text-xl font-bold">Sui-DAT</span>
            </div>
            <p className="text-gray-600 mb-6 max-w-md">
              Decentralized AI training platform built on Sui and Walrus. 
              Democratizing machine learning through privacy-preserving collaboration.
            </p>
            <div className="flex space-x-4">
              <Button variant="outline" size="icon">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/model" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Models
                </Link>
              </li>
              <li>
                <Link href="/dashboard/training" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Training
                </Link>
              </li>
              <li>
                <Link href="/dashboard/contributors" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Contributors
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Contribution Tiers
                </Link>
              </li>
              <li>
                <Link href="/join" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Join Network
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  GitHub
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            © 2024 Sui-DAT. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-gray-600 hover:text-indigo-600 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-600 hover:text-indigo-600 text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-gray-600 hover:text-indigo-600 text-sm transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}