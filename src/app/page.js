"use client"
import React, { useEffect, useState } from "react";

const App = () => {
  const [coinData, setCoinData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCoins = async (pageNum) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=12&page=${pageNum}&sparkline=false`
      );
      const data = await res.json();

      if (data.length === 0) {
        setHasMore(false);
      } else {
        setCoinData((prev) => [...prev, ...data]);
      }
    } catch (err) {
      console.error("Error fetching coins:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and pagination
  useEffect(() => {
    fetchCoins(page);
  }, [page]);

  // Infinite scroll logic
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
        !loading &&
        hasMore
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  // 🔥 filtered data based on search query
  const filteredCoins = coinData.filter((coin) =>
    coin.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col">
      {/* 🔥 Search input added */}
      <div className="flex justify-center my-4">
        <input
          type="text"
          placeholder="Search by coin name"
          className="p-2 w-2xl border border-gray-300 rounded-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
           // 🔥 Update query
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {/* 🔥 Conditional rendering if no result */}
        {filteredCoins.length > 0 ? (
          filteredCoins.map((coin) => (
            <div key={coin.id} className="group relative">
              <img
                alt={coin.imageAlt}
                src={coin.image}
                className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto "
              />
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <a href={coin.href}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {coin.name}
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{coin.color}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">{coin.price}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full text-center py-4 text-gray-500">
            No coins found
          </div> // 🔥 no match message
        )}
      </div>

      {loading && (
        <div className="text-center py-4 text-gray-500">Loading more coins...</div>
      )}

      {!hasMore && (
        <div className="text-center py-4 text-green-500">You've reached the end!</div>
      )}
    </div>
  );
};

export default App;
