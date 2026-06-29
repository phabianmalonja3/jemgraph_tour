"use client";

import React, { useEffect, useState } from "react";
import { 
  MapPin, Search, RefreshCw, AlertCircle,
  CheckCircle, XCircle, Info, Copy, Check,
  Filter, Grid, List, Zap, Package, Database,
  Globe, Lock, Unlock, Eye, EyeOff, Code,
  ChevronDown, ChevronRight, Smartphone, Server,
  Link as LinkIcon, Tag, Clock, Users, Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";
import axios from "axios";

type EndpointInfo = {
  path: string;
  method: string;
  handler: string;
  details?: any;
  produces?: string[];
  consumes?: string[];
  parameters?: string[];
};

type FilterType = {
  method: string;
  search: string;
  group: string;
};

export default function MappingsExplorerPage() {
  const [mappings, setMappings] = useState<EndpointInfo[]>([]);
  const [filteredMappings, setFilteredMappings] = useState<EndpointInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterType>({
    method: "ALL",
    search: "",
    group: "ALL"
  });
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointInfo | null>(null);
  const [expandedEndpoints, setExpandedEndpoints] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [copied, setCopied] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
 
  const fetchMappings = async () => {
    setLoading(true);
    try {
   const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080/api/v0.1' }`,
  withCredentials: true, // Required to send HTTP-only cookies automatically
});

apiClient.defaults.headers.common['Cache-Control'] = 'no-cache';
        const response = await apiClient.get("/actuator/mappings");

        console.log("Raw Mappings Response:", response.data);
      
      if (!response.ok) {
        throw new Error("Failed to fetch mappings");
      }
      
      const data = await response.json();
      
      // Parse the nested mappings structure
      const allMappings: EndpointInfo[] = [];
      
      if (data.contexts) {
        Object.values(data.contexts).forEach((context: any) => {
          if (context.mappings?.dispatcherServlets) {
            Object.values(context.mappings.dispatcherServlets).forEach((servlet: any) => {
              if (Array.isArray(servlet)) {
                servlet.forEach((mapping: any) => {
                  if (mapping.predicate && mapping.handler) {
                    const parsed = parseMapping(mapping);
                    if (parsed.path) {
                      allMappings.push(parsed);
                    }
                  }
                });
              }
            });
          }
          
          // Also check for resource handlers
          if (context.mappings?.dispatcherServlets) {
            const servlets = context.mappings.dispatcherServlets;
            if (servlets.dispatcherServlet && Array.isArray(servlets.dispatcherServlet)) {
              servlets.dispatcherServlet.forEach((mapping: any) => {
                if (mapping.predicate && mapping.handler && !mapping.predicate.includes("produces")) {
                  const parsed = parseMapping(mapping);
                  if (parsed.path && !allMappings.some(m => m.path === parsed.path && m.method === parsed.method)) {
                    allMappings.push(parsed);
                  }
                }
              });
            }
          }
        });
      }
      
      // Remove duplicates
      const uniqueMappings = allMappings.filter((mapping, index, self) =>
        index === self.findIndex((m) => m.path === mapping.path && m.method === mapping.method)
      );
      
      setMappings(uniqueMappings);
      setFilteredMappings(uniqueMappings);
      toast.success(`Loaded ${uniqueMappings.length} API endpoints`);
    } catch (error) {
      console.error("Error fetching mappings:", error);
      toast.error("Failed to load API mappings from backend");
    } finally {
      setLoading(false);
    }
  };

  const parseMapping = (mapping: any): EndpointInfo => {
    // Extract method from predicate string
    let method = "GET";
    let path = "";
    let produces: string[] = [];
    let consumes: string[] = [];
    
    if (mapping.predicate) {
      const predicateStr = String(mapping.predicate);
      
      // Extract HTTP method - matches {GET, POST, etc
      const methodMatch = predicateStr.match(/\{(\w+)\s/);
      if (methodMatch) method = methodMatch[1];
      
      // Extract path - matches patterns like [/actuator/health] or [/bookings/me]
      const pathMatch = predicateStr.match(/\[\/([^\]]+)\]/);
      if (pathMatch) {
        path = "/" + pathMatch[1];
      } else {
        // Try alternative pattern for paths without brackets
        const altPathMatch = predicateStr.match(/\s\/([^\s,\]]+)/);
        if (altPathMatch) {
          path = "/" + altPathMatch[1];
        }
      }
      
      // Clean up path - remove query parameters if any
      if (path.includes("?")) {
        path = path.split("?")[0];
      }
      
      // Extract produces info
      if (predicateStr.includes("produces")) {
        const producesMatch = predicateStr.match(/produces\s+\[([^\]]+)\]/);
        if (producesMatch) {
          produces = producesMatch[1].split("||").map(p => p.trim());
        }
      }
      
      // Extract consumes info
      if (predicateStr.includes("consumes")) {
        const consumesMatch = predicateStr.match(/consumes\s+\[([^\]]+)\]/);
        if (consumesMatch) {
          consumes = consumesMatch[1].split("||").map(c => c.trim());
        }
      }
    }
    
    // Extract handler name
    let handler = "Unknown";
    if (typeof mapping.handler === 'string') {
      handler = mapping.handler;
      // Clean up handler string if it's too long
      if (handler.length > 100) {
        handler = handler.substring(0, 100) + "...";
      }
    } else if (mapping.details?.handlerMethod?.className) {
      const className = mapping.details.handlerMethod.className;
      const methodName = mapping.details.handlerMethod.name || "";
      handler = `${className}#${methodName}`;
    } else if (mapping.handler?.toString) {
      handler = mapping.handler.toString();
      if (handler.length > 100) {
        handler = handler.substring(0, 100) + "...";
      }
    }
    
    return {
      path: path || "/",
      method,
      handler,
      details: mapping.details,
      produces,
      consumes,
    };
  };

  useEffect(() => {
    fetchMappings();
    const interval = setInterval(fetchMappings, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = mappings;
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(m => 
        m.path.toLowerCase().includes(searchLower) ||
        m.handler.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.method !== "ALL") {
      filtered = filtered.filter(m => m.method === filters.method);
    }
    
    if (filters.group !== "ALL") {
      if (filters.group === "ACTUATOR") {
        filtered = filtered.filter(m => m.path.includes("/actuator"));
      } else if (filters.group === "API") {
        filtered = filtered.filter(m => 
          (m.path.includes("/auth") || 
           m.path.includes("/bookings") || 
           m.path.includes("/packages") || 
           m.path.includes("/photographers") ||
           m.path.includes("/users") ||
           m.path.includes("/client"))
        );
      } else if (filters.group === "SWAGGER") {
        filtered = filtered.filter(m => 
          m.path.includes("/v3/api-docs") || 
          m.path.includes("/swagger") || 
          m.path.includes("/api-docs")
        );
      } else if (filters.group === "RESOURCES") {
        filtered = filtered.filter(m => 
          m.path.includes("/webjars") || 
          m.path.includes("/static") ||
          m.path === "/**"
        );
      }
    }
    
    setFilteredMappings(filtered);
  }, [filters, mappings]);

  const toggleEndpoint = (index: number) => {
    const key = `${filteredMappings[index].method}-${filteredMappings[index].path}`;
    const newExpanded = new Set(expandedEndpoints);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedEndpoints(newExpanded);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
    toast.success("Copied to clipboard");
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET": return "bg-green-100 text-green-700 border-green-200";
      case "POST": return "bg-blue-100 text-blue-700 border-blue-200";
      case "PUT": return "bg-orange-100 text-orange-700 border-orange-200";
      case "DELETE": return "bg-red-100 text-red-700 border-red-200";
      case "PATCH": return "bg-purple-100 text-purple-700 border-purple-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getIconByPath = (path: string) => {
    if (path.includes("/actuator")) return <Server size={16} className="text-blue-500" />;
    if (path.includes("/auth")) return <Lock size={16} className="text-purple-500" />;
    if (path.includes("/bookings")) return <Calendar size={16} className="text-green-500" />;
    if (path.includes("/packages")) return <Package size={16} className="text-orange-500" />;
    if (path.includes("/photographers")) return <Users size={16} className="text-indigo-500" />;
    if (path.includes("/users")) return <Users size={16} className="text-teal-500" />;
    if (path.includes("/client")) return <Smartphone size={16} className="text-pink-500" />;
    if (path.includes("/webjars") || path.includes("/swagger")) return <Code size={16} className="text-gray-500" />;
    return <MapPin size={16} className="text-gray-500" />;
  };

  const stats = {
    total: mappings.length,
    get: mappings.filter(m => m.method === "GET").length,
    post: mappings.filter(m => m.method === "POST").length,
    put: mappings.filter(m => m.method === "PUT").length,
    delete: mappings.filter(m => m.method === "DELETE").length,
    patch: mappings.filter(m => m.method === "PATCH").length,
    actuator: mappings.filter(m => m.path.includes("/actuator")).length,
    api: mappings.filter(m => 
      m.path.includes("/auth") || 
      m.path.includes("/bookings") || 
      m.path.includes("/packages") || 
      m.path.includes("/photographers")
    ).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                <MapPin className="text-white w-5 h-5" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
                API Mappings Explorer
              </h1>
            </div>
            <p className="text-gray-500 ml-1">Discover and analyze all API endpoints in Jemigraph Engine</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchMappings}
              className="p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm"
              disabled={loading}
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <StatCard label="Total Endpoints" value={stats.total} icon={MapPin} color="green" />
          <StatCard label="GET" value={stats.get} icon={Eye} color="green" />
          <StatCard label="POST" value={stats.post} icon={Zap} color="blue" />
          <StatCard label="PUT" value={stats.put} icon={Package} color="orange" />
          <StatCard label="DELETE" value={stats.delete} icon={XCircle} color="red" />
          <StatCard label="PATCH" value={stats.patch} icon={CheckCircle} color="purple" />
          <StatCard label="Actuator" value={stats.actuator} icon={Server} color="gray" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 shadow-sm">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-gray-700 font-medium mb-3 lg:hidden"
          >
            <Filter size={16} />
            Filters {showFilters ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
          </button>
          
          <div className={cn("flex flex-col lg:flex-row gap-4", !showFilters && "hidden lg:flex")}>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by path or handler..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
              />
            </div>
            
            <select
              value={filters.method}
              onChange={(e) => setFilters({...filters, method: e.target.value})}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none text-sm"
            >
              <option value="ALL">All Methods</option>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>
            
            <select
              value={filters.group}
              onChange={(e) => setFilters({...filters, group: e.target.value})}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none text-sm"
            >
              <option value="ALL">All Groups</option>
              <option value="ACTUATOR">Actuator Endpoints</option>
              <option value="API">API Endpoints</option>
              <option value="SWAGGER">Swagger/OpenAPI</option>
              <option value="RESOURCES">Static Resources</option>
            </select>
            
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-xl transition-all",
                  viewMode === "list" ? "bg-green-600 text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                )}
              >
                <List size={18} />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-xl transition-all",
                  viewMode === "grid" ? "bg-green-600 text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                )}
              >
                <Grid size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-500">
          Found {filteredMappings.length} of {mappings.length} endpoints
        </div>

        {/* Mappings Display */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
            <p className="mt-4 text-gray-500">Loading API mappings...</p>
          </div>
        ) : filteredMappings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200">
            <AlertCircle size={48} className="text-gray-400 mb-4" />
            <p className="text-gray-500 font-medium">No endpoints found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : viewMode === "list" ? (
          <div className="space-y-3">
            {filteredMappings.map((endpoint, idx) => {
              const key = `${endpoint.method}-${endpoint.path}`;
              const isExpanded = expandedEndpoints.has(key);
              
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-gray-200 hover:border-green-300 transition-all shadow-sm hover:shadow-md"
                >
                  <button
                    onClick={() => toggleEndpoint(idx)}
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-xl"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-gray-400">
                        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </div>
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getIconByPath(endpoint.path)}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={cn("px-2 py-0.5 rounded-full text-xs font-bold border", getMethodColor(endpoint.method))}>
                            {endpoint.method}
                          </span>
                          <code className="font-mono font-semibold text-gray-900 text-sm break-all">
                            {endpoint.path}
                          </code>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 font-mono truncate max-w-2xl">
                          {endpoint.handler.split('#')[0]}
                        </p>
                      </div>
                    </div>
                  </button>
                  
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-gray-100 bg-gray-50/50 rounded-b-xl">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                            <Code size={10} /> Handler Method
                          </label>
                          <div className="flex items-center gap-2">
                            <code className="text-xs font-mono text-gray-700 bg-white px-3 py-2 rounded-lg border border-gray-200 flex-1 break-all">
                              {endpoint.handler}
                            </code>
                            <button
                              onClick={() => copyToClipboard(endpoint.handler, `handler-${idx}`)}
                              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                              {copied === `handler-${idx}` ? <Check size={14} className="text-green-600" /> : <Copy size={14} className="text-gray-400" />}
                            </button>
                          </div>
                        </div>
                        
                        {endpoint.produces && endpoint.produces.length > 0 && (
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Produces</label>
                            <div className="flex flex-wrap gap-2">
                              {endpoint.produces.map((p, i) => (
                                <span key={i} className="px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-mono border border-purple-200">
                                  {p}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {endpoint.consumes && endpoint.consumes.length > 0 && (
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Consumes</label>
                            <div className="flex flex-wrap gap-2">
                              {endpoint.consumes.map((c, i) => (
                                <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-mono border border-blue-200">
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMappings.map((endpoint, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all cursor-pointer overflow-hidden"
                onClick={() => setSelectedEndpoint(endpoint)}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getIconByPath(endpoint.path)}
                    </div>
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-bold border", getMethodColor(endpoint.method))}>
                      {endpoint.method}
                    </span>
                  </div>
                  <code className="font-mono font-semibold text-gray-900 text-sm block mb-2 break-all">
                    {endpoint.path}
                  </code>
                  <p className="text-xs text-gray-500 font-mono line-clamp-2">
                    {endpoint.handler.split('#')[0]}
                  </p>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-[10px] text-gray-400">
                      {endpoint.handler.split('#')[1] || endpoint.handler.split('.').pop()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Endpoint Detail Modal */}
      {selectedEndpoint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedEndpoint(null)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                  <LinkIcon size={18} />
                </div>
                <h2 className="font-bold text-gray-900">Endpoint Details</h2>
              </div>
              <button
                onClick={() => setSelectedEndpoint(null)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">HTTP Method</label>
                <div className="mt-1">
                  <span className={cn("px-3 py-1.5 rounded-full text-sm font-bold border inline-block", getMethodColor(selectedEndpoint.method))}>
                    {selectedEndpoint.method}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Endpoint Path</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="font-mono text-sm font-semibold text-gray-900 bg-gray-50 px-3 py-2 rounded-lg flex-1 break-all">
                    {selectedEndpoint.path}
                  </code>
                  <button
                    onClick={() => copyToClipboard(selectedEndpoint.path, "path")}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {copied === "path" ? <Check size={16} className="text-green-600" /> : <Copy size={16} className="text-gray-400" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Handler</label>
                <p className="font-mono text-xs text-gray-700 mt-1 break-all bg-gray-50 p-3 rounded-lg">
                  {selectedEndpoint.handler}
                </p>
              </div>
              
              {selectedEndpoint.produces && selectedEndpoint.produces.length > 0 && (
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Produces</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedEndpoint.produces.map((p, i) => (
                      <span key={i} className="px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-mono border border-purple-200">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedEndpoint.consumes && selectedEndpoint.consumes.length > 0 && (
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Consumes</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedEndpoint.consumes.map((c, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-mono border border-blue-200">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({ label, value, icon: Icon, color }: any) {
  const colorClasses = {
    green: "bg-green-50 text-green-600",
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
    gray: "bg-gray-50 text-gray-600",
  };
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center gap-3 mb-2">
        <div className={cn("p-2 rounded-lg", colorClasses[color])}>
          <Icon size={16} />
        </div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
    </div>
  );
}