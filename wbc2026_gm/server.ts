import express from "express";
import { createServer as createViteServer } from "vite";
import { MATCHES } from "./constants";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes
  app.get("/api/matches", async (req, res) => {
    try {
      // Fetch data from MLB Stats API (WBC sportId = 51)
      // Fetching a range of dates to ensure we capture all relevant matches
      const startDate = "2026-03-05";
      const endDate = "2026-03-15";
      const url = `https://statsapi.mlb.com/api/v1/schedule?sportId=51&startDate=${startDate}&endDate=${endDate}&hydrate=linescore,team`;
      
      const apiRes = await fetch(url);
      const data = await apiRes.json();
      
      // Clone the static matches to avoid mutating the original import permanently
      // (Note: In a persistent server, this might need better state management)
      let updatedMatches = JSON.parse(JSON.stringify(MATCHES));

      // Map MLB Team Names to our internal IDs
      const TEAM_NAME_MAP: Record<string, string> = {
        "Chinese Taipei": "tpe",
        "Australia": "aus",
        "Czechia": "cze",
        "Korea": "kor",
        "Japan": "jpn",
        "Cuba": "cub",
        "Panama": "pan",
        "Colombia": "col",
        "Puerto Rico": "pur",
        "Canada": "can",
        "Mexico": "mex",
        "Great Britain": "gbr",
        "USA": "usa",
        "Brazil": "bra",
        "Italy": "ita",
        "Netherlands": "ned",
        "Venezuela": "ven",
        "Israel": "isr",
        "Nicaragua": "nic",
        "Dominican Republic": "dom"
      };

      if (data.dates && data.dates.length > 0) {
        data.dates.forEach((dateItem: any) => {
          const games = dateItem.games;
          
          games.forEach((game: any) => {
            const homeName = game.teams.home.team.name;
            const awayName = game.teams.away.team.name;
            
            const homeId = TEAM_NAME_MAP[homeName];
            const awayId = TEAM_NAME_MAP[awayName];
            
            if (homeId && awayId) {
              // Find the match in our static data
              const match = updatedMatches.find((m: any) => 
                (m.homeTeamId === homeId && m.awayTeamId === awayId) ||
                (m.homeTeamId === awayId && m.awayTeamId === homeId)
              );
              
              if (match) {
                // Update Status
                const status = game.status.abstractGameState;
                if (status === "Final" || status === "Game Over") {
                  match.status = "FINISHED";
                } else if (status === "Live" || status === "In Progress") {
                  match.status = "LIVE";
                } else {
                  match.status = "SCHEDULED";
                }
                
                // Update Scores
                // Ensure we map correctly based on who is home/away in our data vs API
                if (match.homeTeamId === homeId) {
                   match.scores = { home: game.teams.home.score, away: game.teams.away.score };
                   if (game.linescore && game.linescore.teams) {
                     match.stats = {
                       home: { hits: game.linescore.teams.home.hits, errors: game.linescore.teams.home.errors },
                       away: { hits: game.linescore.teams.away.hits, errors: game.linescore.teams.away.errors }
                     };
                   }
                } else {
                   match.scores = { home: game.teams.away.score, away: game.teams.home.score };
                   if (game.linescore && game.linescore.teams) {
                     match.stats = {
                       home: { hits: game.linescore.teams.away.hits, errors: game.linescore.teams.away.errors },
                       away: { hits: game.linescore.teams.home.hits, errors: game.linescore.teams.home.errors }
                     };
                   }
                }
                
                // Update Live Data
                if (match.status === "LIVE" && game.linescore) {
                  match.liveData = {
                    currentInning: `${game.linescore.currentInningOrdinal || ''} ${game.linescore.isTopInning ? 'Top' : 'Bot'}`,
                    outs: game.linescore.outs || 0,
                    bases: [
                      !!game.linescore.offense?.first,
                      !!game.linescore.offense?.second,
                      !!game.linescore.offense?.third
                    ],
                    count: {
                      b: game.linescore.balls || 0,
                      s: game.linescore.strikes || 0,
                      o: game.linescore.outs || 0
                    }
                  };
                }
              }
            }
          });
        });
      }
      
      res.json(updatedMatches);

    } catch (error) {
      console.error("Error fetching MLB data:", error);
      // Fallback to static data if API fails
      const matchesWithTimestamp = MATCHES.map(match => ({
        ...match,
        lastUpdated: new Date().toISOString()
      }));
      res.json(matchesWithTimestamp);
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
