"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Search, Zap, X, Film, User, Sparkles } from "lucide-react";
import { useActiveUser } from "@/context/ActiveUserContext";

type Movie = {
  id: number;
  title: string;
  year: number;
  genres: string[];
  desc: string;
};

type SearchUser = {
  id: number;
  name: string;
};

const MOVIES: Movie[] = [
  { id: 1, title: "Blade Runner 2049", year: 2017, genres: ["Sci-Fi", "Thriller"], desc: "A new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what's left of society into chaos." },
  { id: 2, title: "Interstellar", year: 2014, genres: ["Sci-Fi", "Drama"], desc: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival." },
  { id: 3, title: "Ex Machina", year: 2014, genres: ["Sci-Fi", "Thriller"], desc: "A young programmer is selected to participate in a ground-breaking experiment in synthetic intelligent life." },
  { id: 4, title: "Arrival", year: 2016, genres: ["Sci-Fi", "Drama"], desc: "A linguist works with the military to communicate with alien lifecycles that have appeared on Earth." },
  { id: 5, title: "Her", year: 2013, genres: ["Sci-Fi", "Romance"], desc: "In a near future, a lonely writer develops an unlikely relationship with an operating system designed to meet his every need." },
  { id: 6, title: "Ghost in the Shell", year: 1995, genres: ["Sci-Fi", "Action"], desc: "A cyborg policewoman and her partner hunt a mysterious and powerful hacker called the Puppet Master." },
  { id: 7, title: "Annihilation", year: 2018, genres: ["Sci-Fi", "Horror"], desc: "A biologist signs up for a dangerous, secret expedition into a mysterious zone where the laws of nature don't apply." },
  { id: 8, title: "Dune", year: 2021, genres: ["Sci-Fi", "Adventure"], desc: "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset while its heir is troubled by visions." }
];

export function TopBar() {
  const { setActiveUserId } = useActiveUser();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter movies
  const matchingMovies = query.trim()
    ? MOVIES.filter(m => 
        m.title.toLowerCase().includes(query.toLowerCase()) || 
        m.genres.some(g => g.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  // Filter users
  const matchingUsers: SearchUser[] = [];
  if (query.trim()) {
    const numericQuery = parseInt(query.replace(/\D/g, ""), 10);
    if (!isNaN(numericQuery) && numericQuery > 0 && numericQuery <= 568) {
      matchingUsers.push({ id: numericQuery, name: `User ${numericQuery}` });
    } else if ("rahul".includes(query.toLowerCase()) || query.includes("943")) {
      matchingUsers.push({ id: 943, name: "Rahul L. (User 943)" });
    }
  }


  const showDropdown = isOpen && (matchingMovies.length > 0 || matchingUsers.length > 0);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 border-b border-border bg-bg-base/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-8">
      <div className="flex items-center gap-4 w-96 relative" ref={dropdownRef}>
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search movies, users, or latent dimensions..."
            className="w-full h-9 bg-bg-surface border border-border rounded-lg pl-9 pr-8 text-sm focus:outline-none focus:border-accent-blue transition-colors text-white"
          />
          {query && (
            <button 
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Dropdown */}
        {showDropdown && (
          <div className="absolute top-11 left-0 w-full bg-bg-surface/95 border border-border rounded-xl shadow-2xl backdrop-blur-xl z-50 overflow-hidden max-h-96 overflow-y-auto">
            {matchingMovies.length > 0 && (
              <div className="p-3 border-b border-border/50">
                <div className="text-[10px] font-bold text-accent-blue uppercase tracking-wider mb-2 px-2">Movies</div>
                <div className="space-y-1">
                  {matchingMovies.map((movie) => (
                    <div 
                      key={movie.id}
                      onClick={() => {
                        setSelectedMovie(movie);
                        setIsOpen(false);
                      }}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Film className="w-4 h-4 text-text-muted" />
                        <div>
                          <div className="text-sm font-semibold text-white">{movie.title}</div>
                          <div className="text-xs text-text-muted">{movie.genres.join(", ")} &bull; {movie.year}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {matchingUsers.length > 0 && (
              <div className="p-3">
                <div className="text-[10px] font-bold text-accent-teal uppercase tracking-wider mb-2 px-2">Users</div>
                <div className="space-y-1">
                  {matchingUsers.map((user) => (
                    <div 
                      key={user.id}
                      onClick={() => {
                        setIsOpen(false);
                        setQuery("");
                        setActiveUserId(user.id);
                      }}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-text-muted" />
                        <div>
                          <div className="text-sm font-semibold text-white">{user.name}</div>
                          <div className="text-xs text-text-muted">Latent ID: {user.id}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent-teal animate-pulse" />
          <span className="text-xs text-text-muted font-medium">System Online</span>
        </div>
        
        <div className="h-6 w-px bg-border" />
        
        <button className="relative text-text-muted hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent-coral rounded-full border-2 border-bg-base" />
        </button>
        
        <div className="flex items-center gap-2 bg-accent-blue/10 border border-accent-blue/20 rounded-full pl-2 pr-3 py-1 cursor-pointer hover:bg-accent-blue/20 transition-colors">
          <Zap className="w-4 h-4 text-accent-blue" />
          <span className="text-xs font-semibold text-accent-blue">GPU Idle</span>
        </div>
      </div>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-bg-surface border border-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
            <button 
              onClick={() => setSelectedMovie(null)}
              className="absolute right-4 top-4 text-text-muted hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-accent-blue/10 rounded-xl text-accent-blue">
                  <Film className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedMovie.title}</h2>
                  <p className="text-sm text-text-muted">{selectedMovie.year} &bull; {selectedMovie.genres.join(", ")}</p>
                </div>
              </div>
              <p className="text-sm text-text-muted leading-relaxed pt-2">
                {selectedMovie.desc}
              </p>
              
              <div className="border-t border-border pt-4 mt-2 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">Recommendation Confidence</span>
                  <span className="font-semibold text-accent-teal">94% Match</span>
                </div>
                <div className="w-full bg-bg-base h-2 rounded-full overflow-hidden border border-border">
                  <div className="bg-accent-teal h-full rounded-full" style={{ width: "94%" }} />
                </div>
              </div>

              <div className="bg-accent-blue/5 border border-accent-blue/10 rounded-xl p-4 flex gap-3 items-start mt-2">
                <Sparkles className="w-5 h-5 text-accent-blue shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-accent-blue uppercase tracking-wider mb-1">ARIA Explainability</div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    This movie matches the active user&apos;s preference in Sci-Fi and thematic Auteur style. Reconstructed through the VAE latent vector layer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
