using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading;
using Microsoft.AspNet.SignalR;
using Newtonsoft.Json;
using System.Linq;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;

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

        public string Register(Snake newSnake)
        {
            newSnake.connectionId = Context.ConnectionId;
            return _broadcaster.Register(newSnake);
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            _broadcaster.RemoveSnake(Context.ConnectionId);
            return base.OnDisconnected(stopCalled);
        }

        public override async Task OnConnected()
        {
            await base.OnConnected();
            Clients.Client(Context.ConnectionId).addSnakes(Broadcaster.Snakes.Values);
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
        private readonly TimeSpan BroadcastInterval = TimeSpan.FromMilliseconds(40); //broadcast maximum of 25 times per second, client runs at 24 fps
        private readonly IHubContext _hubContext;
        private readonly Timer _broadcastLoop;
        public readonly static ConcurrentDictionary<string, Snake> Snakes = new ConcurrentDictionary<string, Snake>();

        public Broadcaster()
        {
            _hubContext = GlobalHost.ConnectionManager.GetHubContext<SlinkHub>();
            _broadcastLoop = new Timer(BroadcastPositions, null, BroadcastInterval, BroadcastInterval);
        }

        public void BroadcastPositions(object state)
        {
            var remoteSnakes = Snakes.Values.ToList();
            if (remoteSnakes.Any())
            {
                _hubContext.Clients.All.updatePositions(remoteSnakes);
            }
        }
        public void UpdatePosition(Snake client)
        {
            Snakes[client.connectionId] = client;
        }

        internal string Register(Snake client)
        {
            if (Snakes.TryAdd(client.connectionId, client))
            {
                _hubContext.Clients.AllExcept(client.connectionId).addSnake(client);
                return client.connectionId;
            }

            return string.Empty;
        }

        internal void RemoveSnake(string connectionId)
        {
            if(Snakes.TryRemove(connectionId, out _))
                _hubContext.Clients.All.removeSnake(connectionId);
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