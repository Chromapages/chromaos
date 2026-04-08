import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Search, 
  Filter, 
  Download,
  ArrowRight,
  Users
} from 'lucide-react';
import Link from 'next/link';

async function getAllLeads() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${baseUrl}/api/leads?limit=100`, { cache: 'no-store' });
    const data = await res.json();
    return data.leads || [];
  } catch (error) {
    console.error('Failed to fetch leads:', error);
    return [];
  }
}

export default async function LeadsListPage() {
  const leads = await getAllLeads();

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-center">Unified Leads</h1>
          <p className="text-muted-foreground mt-1">Manage and route incoming leads across all brands.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search leads..." 
            className="w-full pl-10 pr-4 py-2 bg-card border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="text-sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <select className="bg-card border rounded-lg text-sm px-3 py-2 focus:outline-none">
            <option>All Brands</option>
            <option>BuiltExpert</option>
            <option>ChromaPages</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-3">Lead</th>
                <th className="px-6 py-3">Contact info</th>
                <th className="px-6 py-3">Brand</th>
                <th className="px-6 py-3">Stage</th>
                <th className="px-6 py-3">Created</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leads.map((lead: any) => (
                <tr key={lead.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-foreground">{lead.fullName}</div>
                    <div className="text-xs text-muted-foreground italic">{lead.sourceDetail || lead.source}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-foreground">{lead.email || '—'}</div>
                    <div className="text-xs text-muted-foreground">{lead.phone || ''}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="capitalize">{lead.brandId || '—'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-secondary text-secondary-foreground border border-border uppercase tracking-tight">
                      {lead.stageId?.replace('-', ' ') || 'New'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {lead.createdAt ? new Date(lead.createdAt.seconds * 1000).toLocaleDateString() : 'Recent'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/leads/${lead.id}`}>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        Details
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground italic">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    No leads found in the system.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
