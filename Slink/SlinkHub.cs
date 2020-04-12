using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading;
using Microsoft.AspNet.SignalR;
using Newtonsoft.Json;
using System.Linq;
using Newtonsoft.Json.Linq;

namespace Slink
{
    public class SlinkHub : Hub
    {
        private Broadcaster _broadcaster;
        public SlinkHub()
            : this(Broadcaster.Instance)
        {
        }

        public SlinkHub(Broadcaster broadcaster)
        {
            _broadcaster = broadcaster;
        }

        public void UpdatePosition(Snake snake)
        {
            snake.connectionId = Context.ConnectionId;
            snake.updated = true;
            _broadcaster.UpdatePosition(snake);
        }

        public void Register(Snake newSnake)
        {
            newSnake.connectionId = Context.ConnectionId;
            _broadcaster.Register(newSnake);
        }
    }

    public class Snake
    {
        public string name { get; set; }

        public double moveX { get; set; }

        public double moveY { get; set; }

        public bool isAccelerating { get; set; }

        public List<Segment> segments { get; set; }

        public bool updated { get; set; }

        public string connectionId { get; set; }
    }

    public class Segment
    {
        public double x { get; set; }

        public double y { get; set; }
    }

    public class Broadcaster
    {
        private readonly static Lazy<Broadcaster> _instance = new Lazy<Broadcaster>(() => new Broadcaster());
        private readonly TimeSpan BroadcastInterval = TimeSpan.FromMilliseconds(40); //broadcast maximum of 25 times per second
        private readonly IHubContext _hubContext;
        private readonly Timer _broadcastLoop;
        private readonly static ConcurrentDictionary<string, Snake> _snakes = new ConcurrentDictionary<string, Snake>();

        public Broadcaster()
        {
            _hubContext = GlobalHost.ConnectionManager.GetHubContext<SlinkHub>();
            _broadcastLoop = new Timer(BroadcastPositions, null, BroadcastInterval, BroadcastInterval);
        }

        public void BroadcastPositions(object state)
        {
            var remoteSnakes = _snakes.Values.Where(x => x.updated);
            if (remoteSnakes.Any())
            {
                _hubContext.Clients.All.updatePositions(remoteSnakes);
            }
        }
        public void UpdatePosition(Snake client)
        {
            _snakes[client.connectionId] = client;
        }

        internal void Register(Snake client)
        {
            //var copy = new Snake()
            //{
            //    connectionId = "Fake snake",
            //    isAccelerating = client.isAccelerating,
            //    moveY = client.moveY,
            //    moveX = client.moveX,
            //    segments = client.segments,
            //    name = "no u",
            //    updated = true
            //};
            //copy.segments[0].x += 50;
            //_snakes.TryAdd(copy.connectionId, copy);
            //_hubContext.Clients.All.addSnake(copy);

            if (_snakes.TryAdd(client.connectionId, client))
                _hubContext.Clients.AllExcept(client.connectionId).addSnake(client);
        }

        public static Broadcaster Instance
        {
            get
            {
                return _instance.Value;
            }
        }
    }
}