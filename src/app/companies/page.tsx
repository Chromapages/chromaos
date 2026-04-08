"use client";

import React, { useEffect, useState } from 'react';
import { Company } from '@/lib/crm/types';
import { Button } from '@/components/ui/button';
import { Plus, Search, Building2, ExternalLink, Globe, Factory } from 'lucide-react';
import Link from 'next/link';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await fetch('/api/companies');
        const data = await res.json();
        if (data.companies) {
          setCompanies(data.companies);
        }
      } catch (error) {
        console.error('Failed to fetch companies:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(c => 
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.industry?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
          <p className="text-muted-foreground">Manage your client organizations and their firmographic data.</p>
        </div>
        <Button className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          Add Company
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search companies by name or industry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-muted/50 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-card border rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-muted/10 rounded-3xl border-2 border-dashed">
          <Building2 className="w-12 h-12 text-muted-foreground/30" />
          <div className="space-y-1">
            <h3 className="font-medium">No companies found</h3>
            <p className="text-sm text-muted-foreground max-w-xs">Start building your CRM by adding your first company record.</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Company
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <Link 
              key={company.id} 
              href={`/companies/${company.id}`}
              className="group bg-card border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Building2 size={24} />
                </div>
                <ExternalLink size={16} className="text-muted-foreground/0 group-hover:text-muted-foreground/50 transition-all duration-300" />
              </div>
              
              <div className="space-y-1">
                <h3 className="font-semibold text-lg line-clamp-1">{company.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Factory size={14} />
                  <span>{company.industry || 'Unknown Industry'}</span>
                </div>
                {company.website && (
                  <div className="flex items-center gap-2 text-sm text-primary/80 group-hover:text-primary transition-colors">
                    <Globe size={14} />
                    <span className="line-clamp-1">{company.website.replace(/^https?:\/\//, '')}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t flex items-center justify-between text-xs text-muted-foreground">
                <span>Created {new Date(company.createdAt).toLocaleDateString()}</span>
                <span className="px-2 py-1 bg-muted rounded-full">Active</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
