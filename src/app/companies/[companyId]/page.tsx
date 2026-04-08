"use client";

import React, { useEffect, useState } from 'react';
import { Company, Lead, Deal, Activity } from '@/lib/crm/types';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Globe, 
  Factory, 
  Calendar, 
  ArrowLeft, 
  Plus, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function CompanyDetailPage() {
  const { companyId } = useParams();
  const [data, setData] = useState<{
    company: Company;
    leads: Lead[];
    deals: Deal[];
    activities: Activity[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompanyDetails() {
      try {
        const res = await fetch(`/api/companies/${companyId}`);
        const result = await res.json();
        if (result.company) {
          setData(result);
        }
      } catch (error) {
        console.error('Failed to fetch company details:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCompanyDetails();
  }, [companyId]);

  if (loading) {
    return <div className="p-8 animate-pulse space-y-8">
      <div className="h-8 w-48 bg-muted rounded" />
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 h-96 bg-muted rounded-2xl" />
        <div className="h-96 bg-muted rounded-2xl" />
      </div>
    </div>;
  }

  if (!data) return <div className="p-8 text-center mt-20">Company not found.</div>;

  const { company, leads, deals, activities } = data;

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Link href="/companies">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{company.name}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
            <div className="flex items-center gap-1.5">
              <Globe className="w-4 h-4" />
              {company.website || 'No website'}
            </div>
            <div className="flex items-center gap-1.5">
              <Factory className="w-4 h-4" />
              {company.industry || 'Unknown industry'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Leads Section */}
          <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-2 font-semibold">
                <Users className="w-4 h-4 text-primary" />
                Linked Leads
              </div>
              <Button variant="ghost" size="sm" className="text-xs h-8">View all</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/20 text-muted-foreground text-[10px] uppercase font-bold tracking-widest">
                  <tr>
                    <th className="px-6 py-3">Lead Name</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {leads.map(lead => (
                    <tr key={lead.id} className="hover:bg-muted/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-medium">{lead.fullName}</div>
                        <div className="text-xs text-muted-foreground">{lead.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-tight border border-emerald-200">
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/leads/${lead.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg group-hover:bg-background group-hover:shadow-sm">
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground italic">No leads linked to this company.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Deals Section */}
          <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-2 font-semibold">
                <TrendingUp className="w-4 h-4 text-primary" />
                Active Deals
              </div>
              <Button variant="ghost" size="sm" className="text-xs h-8 text-primary font-bold">+ New Deal</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/20 text-muted-foreground text-[10px] uppercase font-bold tracking-widest">
                  <tr>
                    <th className="px-6 py-3">Deal Title</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {deals.map(deal => (
                    <tr key={deal.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 font-medium">{deal.title}</td>
                      <td className="px-6 py-4">${deal.amount?.toLocaleString()}</td>
                      <td className="px-6 py-4 capitalize">{deal.status}</td>
                    </tr>
                  ))}
                  {deals.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-muted-foreground">
                        <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-20" />
                        <p className="italic">No deals found for this company.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Overview Info Card */}
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" />
              Firmographics
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Region</span>
                <span className="text-sm font-medium">North America</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm font-medium">{new Date(company.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Brand</span>
                <span className="text-sm font-medium px-2 py-0.5 bg-primary/5 text-primary rounded-lg border border-primary/10 tracking-tight">
                  {company.brandId || 'All Brands'}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold mb-6 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Activity Stream
            </h3>
            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-2.5 before:h-full before:w-0.5 before:bg-muted/50">
              {activities.map((activity, idx) => (
                <div key={activity.id} className="relative flex items-start pl-8">
                  <div className={`absolute left-0 mt-1.5 w-5 h-5 rounded-full border-4 border-background shadow-sm ${idx === 0 ? 'bg-primary' : 'bg-muted'}`} />
                  <div className="space-y-1">
                    <p className="text-sm text-foreground">{activity.summary}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{activity.agentName}</span>
                      <span>•</span>
                      <span>{new Date(activity.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
              {activities.length === 0 && (
                <div className="text-center py-6 text-muted-foreground text-sm italic">
                  No recent activity logged.
                </div>
              )}
            </div>
            {activities.length > 0 && (
              <Button variant="ghost" className="w-full mt-6 text-xs h-8 text-muted-foreground">View Full Timeline</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
