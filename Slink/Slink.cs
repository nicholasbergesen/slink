using Slink.Properties;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Slink
{
    public class Slink
    {
        public static ConcurrentDictionary<string, Snake> Snakes = new ConcurrentDictionary<string, Snake>();
        public static List<Coord> Food = new List<Coord>();
        public static int Bounds { get; } = Settings.Default.CanvasBounds;

        static Slink()
        {
            PopulateFood();
        }

        public static void PopulateFood()
        {
            Random random = new Random();

            for (int x = 0; x < Bounds; x++)
            {
                for (int y = 0; y < Bounds; y++)
                {
                    if(random.Next(1, 1000) < 50)
                    {
                        Food.Add(new Coord() { x = x, y = y });
                    }
                }
            }
        }
    }

    public class Snake
    {
        public string name { get; set; }

        public double moveX { get; set; }

        public double moveY { get; set; }

        public bool isAccelerating { get; set; }

        public List<Coord> segments { get; set; }

        public int updateCounter { get; set; }

        public string connectionId { get; set; }
    }

    public class Coord
    {
        public double x { get; set; }

        public double y { get; set; }
    }
}