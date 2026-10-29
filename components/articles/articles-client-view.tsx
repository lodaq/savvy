'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { IArticle } from '@/models/article';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDate } from '@/lib/utils';
import {
  Search,
  X,
  FileText,
  ArrowUpRight,
  Edit,
  Star,
  RotateCcw,
} from 'lucide-react';

interface ArticlesClientViewProps {
  initialArticles: IArticle[];
}

export function ArticlesClientView({ initialArticles }: ArticlesClientViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedFeatured, setSelectedFeatured] = useState<boolean>(false);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title-asc' | 'title-desc'>('newest');

  // Extract all unique tags sorted by frequency
  const allTags = useMemo(() => {
    const tagCountMap: Record<string, number> = {};
    initialArticles.forEach((a) => {
      (a.tags || []).forEach((t) => {
        const clean = t.trim();
        if (clean && clean !== 'null' && clean !== 'undefined') {
          tagCountMap[clean] = (tagCountMap[clean] || 0) + 1;
        }
      });
    });
    return Object.entries(tagCountMap)
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag);
  }, [initialArticles]);

  // Filtered & Sorted Articles
  const filteredArticles = useMemo(() => {
    return initialArticles
      .filter((article) => {
        // Search query filter (matches title, description, slug, or tags)
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchTitle = (article.title || '').toLowerCase().includes(query);
          const matchDesc = (article.description || '').toLowerCase().includes(query);
          const matchSlug = (article.slug || '').toLowerCase().includes(query);
          const matchTag = (article.tags || []).some((t) => (t || '').toLowerCase().includes(query));
          if (!matchTitle && !matchDesc && !matchSlug && !matchTag) return false;
        }

        // Type filter
        if (selectedType !== 'all') {
          if ((article.type || 'article') !== selectedType) return false;
        }

        // Status filter
        if (selectedStatus !== 'all') {
          if (selectedStatus === 'published' && !article.published) return false;
          if (selectedStatus === 'draft' && article.published) return false;
        }

        // Featured filter
        if (selectedFeatured && !article.featured) {
          return false;
        }

        // Tag filter
        if (selectedTag) {
          if (!(article.tags || []).map((t) => t.toLowerCase()).includes(selectedTag.toLowerCase())) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === 'title-asc') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'title-desc') {
          return b.title.localeCompare(a.title);
        }
        return 0;
      });
  }, [initialArticles, searchQuery, selectedType, selectedStatus, selectedFeatured, selectedTag, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedType !== 'all' ||
    selectedStatus !== 'all' ||
    selectedFeatured !== false ||
    selectedTag !== '';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedStatus('all');
    setSelectedFeatured(false);
    setSelectedTag('');
    setSortBy('newest');
  };

  const getTypeBadgeClass = (type?: string) => {
    switch (type) {
      case 'notes':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'tutorial':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      case 'snippet':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Search & Filtering Suite */}
      <div className="space-y-3 w-full">
        {/* Main Toolbar: Search Input and the 4 buttons aligned horizontally */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full">
          {/* Search Input Box */}
          <div className="relative flex-1 min-w-0 w-full">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              type="text"
              placeholder={`Search ${initialArticles.length} articles by title, description, or #tag...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 h-10 rounded-xl bg-card border-border/80 text-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary/40 shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-full hover:bg-muted"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 4 Buttons on the exact same horizontal row */}
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto overflow-x-auto no-scrollbar">
            {/* Type Filter */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="h-10 rounded-xl bg-card border-border/80 text-xs w-[115px] shrink-0 font-medium">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="article">Articles</SelectItem>
                <SelectItem value="notes">Notes</SelectItem>
                <SelectItem value="tutorial">Tutorials</SelectItem>
                <SelectItem value="snippet">Snippets</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="h-10 rounded-xl bg-card border-border/80 text-xs w-[115px] shrink-0 font-medium">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Drafts</SelectItem>
              </SelectContent>
            </Select>

            {/* Featured Filter Toggle Button */}
            <Button
              type="button"
              variant={selectedFeatured ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFeatured(!selectedFeatured)}
              className={`h-10 px-3 gap-1.5 text-xs rounded-xl border-border/80 transition-all font-medium shrink-0 ${
                selectedFeatured
                  ? 'bg-amber-500 hover:bg-amber-600 text-white border-transparent'
                  : 'bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${selectedFeatured ? 'fill-white text-white' : ''}`} />
              <span>Featured</span>
            </Button>

            {/* Sort Selector */}
            <Select value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
              <SelectTrigger className="h-10 rounded-xl bg-card border-border/80 text-xs w-[125px] shrink-0 font-medium">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="title-asc">Title (A → Z)</SelectItem>
                <SelectItem value="title-desc">Title (Z → A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tags Bar & Results Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1">
          {/* Scrollable Tag Chips */}
          {allTags.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-full">
              <button
                type="button"
                onClick={() => setSelectedTag('')}
                className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  !selectedTag
                    ? 'bg-foreground text-background font-semibold shadow-2xs'
                    : 'bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                All Tags
              </button>
              {allTags.slice(0, 16).map((tag) => {
                const isSelected = selectedTag.toLowerCase() === tag.toLowerCase();
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(isSelected ? '' : tag)}
                    className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      isSelected
                        ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                        : 'bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted border border-border/50'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          )}

          {/* Counts & Reset */}
          <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto text-muted-foreground text-xs">
            <span>
              Showing <strong className="text-foreground">{filteredArticles.length}</strong> of {initialArticles.length} articles
            </span>
            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </Button>
            )}
          </div>
        </div>

        {/* Active Filter Chips (if any filter is selected) */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs text-muted-foreground mr-1">Active filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                Search: &ldquo;{searchQuery}&rdquo;
                <button type="button" onClick={() => setSearchQuery('')} className="hover:opacity-70">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedType !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium capitalize">
                Type: {selectedType}
                <button type="button" onClick={() => setSelectedType('all')} className="hover:opacity-70">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedStatus !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium capitalize">
                Status: {selectedStatus}
                <button type="button" onClick={() => setSelectedStatus('all')} className="hover:opacity-70">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedFeatured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-medium">
                Featured only
                <button type="button" onClick={() => setSelectedFeatured(false)} className="hover:opacity-70">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedTag && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                Tag: #{selectedTag}
                <button type="button" onClick={() => setSelectedTag('')} className="hover:opacity-70">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs text-muted-foreground hover:text-primary underline ml-1"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Articles Grid or Empty States */}
      {initialArticles.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border/80 bg-card/40 flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/5 text-primary flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No articles yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            You haven&apos;t written any articles yet. Write your first MDX post or import existing markdown files!
          </p>
          <Link href="/articles/new">
            <Button variant="outline" className="mt-2">
              Start Writing
            </Button>
          </Link>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border/80 bg-card/40 flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No matching articles found</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            We couldn&apos;t find any articles matching your search or filters. Try adjusting your query.
          </p>
          <Button variant="outline" size="sm" onClick={resetFilters} className="mt-2 gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredArticles.map((article) => (
            <div
              key={String(article._id)}
              className="group p-5 rounded-2xl border border-border/80 bg-card hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between gap-4 text-left"
            >
              <div className="space-y-3">
                {/* Card Header: Status, Type, Featured, and Date */}
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Status Badge */}
                    <span
                      className={`px-2 py-0.5 rounded-full font-medium text-[11px] ${
                        article.published
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {article.published ? 'Published' : 'Draft'}
                    </span>

                    {/* Type Badge */}
                    <span
                      className={`px-2 py-0.5 rounded-md font-medium text-[11px] capitalize border ${getTypeBadgeClass(
                        article.type
                      )}`}
                    >
                      {article.type || 'article'}
                    </span>

                    {/* Featured Star Badge */}
                    {article.featured && (
                      <span
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[11px] font-medium"
                        title="Featured article"
                      >
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>Featured</span>
                      </span>
                    )}
                  </div>

                  <span className="text-muted-foreground text-[11px] shrink-0">
                    {formatDate(article.createdAt)}
                  </span>
                </div>

                {/* Article Title */}
                <Link href={`/articles/${article.slug}`}>
                  <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                </Link>

                {/* Article Description */}
                {article.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {article.description}
                  </p>
                )}

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {article.tags
                      .filter((t) => t && t !== 'null' && t !== 'undefined')
                      .map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setSelectedTag(tag === selectedTag ? '' : tag)}
                          className={`text-[11px] px-2 py-0.5 rounded-md font-medium transition-colors ${
                            selectedTag.toLowerCase() === tag.toLowerCase()
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
                          }`}
                          title={`Filter by #${tag}`}
                        >
                          #{tag}
                        </button>
                      ))}
                  </div>
                )}
              </div>

              {/* Card Footer: Read & Edit */}
              <div className="flex items-center justify-between pt-3 border-t border-border/40">
                <Link
                  href={`/articles/${article.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  <span>Read Article</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>

                <Link href={`/articles/${article.slug}/edit`}>
                  <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
