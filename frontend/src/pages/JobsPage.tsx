import { useState } from 'react';
import { useGetAllJobs, useSearchJobs } from '../hooks/useQueries';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { Search, MapPin, Building2, DollarSign } from 'lucide-react';

export default function JobsPage() {
  const [searchText, setSearchText] = useState('');
  
  const allJobs = useGetAllJobs();
  const searchResults = useSearchJobs(searchText);

  const jobs = searchText ? searchResults.data || [] : allJobs.data || [];
  const isLoading = searchText ? searchResults.isLoading : allJobs.isLoading;

  return (
    <div className="container px-4 py-6 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1">Job Listings</h1>
        <p className="text-muted-foreground">Find your next opportunity</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search jobs..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Jobs List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No jobs found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{job.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Building2 className="h-4 w-4" />
                      <span>{job.company}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {job.category}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {job.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    {job.salary && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span>{Number(job.salary)} ETB</span>
                      </div>
                    )}
                  </div>
                  <Button size="sm" variant="default">
                    Apply
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
