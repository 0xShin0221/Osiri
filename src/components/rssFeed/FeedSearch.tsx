import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from 'lucide-react'

interface FeedSearchProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  languageFilter: string
  onLanguageChange: (language: string) => void
  languages: string[]
}

export function FeedSearch({
  searchQuery,
  onSearchChange,
  languageFilter,
  onLanguageChange,
  languages
}: FeedSearchProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search by feed name or description"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Select value={languageFilter} onValueChange={onLanguageChange}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Languages</SelectItem>
          {languages.map(lang => (
            <SelectItem key={lang} value={lang}>
              {lang.toUpperCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}