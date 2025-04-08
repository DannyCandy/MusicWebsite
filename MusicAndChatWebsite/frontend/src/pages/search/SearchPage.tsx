import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";

const SearchPage = () => {
  const { albums, fetchAlbums, isLoading } = useMusicStore(); 
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAlbums, setFilteredAlbums] = useState(albums);
  
  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  useEffect(() => {
    if (!isLoading && albums) {
      const filtered = albums.filter((album) =>
        album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (album.artist && album.artist.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredAlbums(filtered);
    }
  }, [searchQuery, albums, isLoading]);

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-4">
      {/* Search Input */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search albums, songs, or artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 pl-10 bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zinc-600"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Search Results */}
      <div className="rounded-lg bg-zinc-900 p-4">
        <h2 className="text-xl font-semibold mb-4">Search Results</h2>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-2">
            {isLoading ? (
              <PlaylistSkeleton />
            ) : filteredAlbums.length > 0 ? (
              filteredAlbums.map((album) => (
                <Link
                  to={`/albums/${album._id}`}
                  key={album._id}
                  className="p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer"
                >
                  <img
                    src={album.imageUrl}
                    alt={`${album.title} album cover`}
                    className="size-12 rounded-md flex-shrink-0 object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{album.title}</p>
                    <p className="text-sm text-zinc-400 truncate">Album • {album.artist}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center text-gray-400">No results found.</p>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default SearchPage;