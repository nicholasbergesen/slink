using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;
using Newtonsoft.Json;
using System.Linq;

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
            snake.ConnectionId = Context.ConnectionId;
            snake.Updated = true;
            _broadcaster.UpdatePosition(snake);
        }

        public void Register(Snake newSnake)
        {
            newSnake.ConnectionId = Context.ConnectionId;
            _broadcaster.Register(newSnake);
        }
    }

    public class Snake
    {
        [JsonProperty("clientName")]
        public string Name { get; set; }

        [JsonProperty("moveX")]
        public double MoveX { get; set; }

        [JsonProperty("moveY")]
        public double MoveY { get; set; }

        [JsonProperty("isAccelerating")]
        public bool IsAccelerating { get; set; }

        [JsonProperty("segments")]
        public List<double> Segments { get; set; }

        [JsonIgnore]
        public bool Updated { get; set; }

        [JsonProperty("connectionId")]
        public string ConnectionId { get; set; }
    }

    public class Broadcaster
    {
        private readonly static Lazy<Broadcaster> _instance = new Lazy<Broadcaster>(() => new Broadcaster());
        private readonly TimeSpan BroadcastInterval = TimeSpan.FromMilliseconds(40); //broadcast maximum of 25 times per second
        private readonly IHubContext _hubContext;
        private readonly Timer _broadcastLoop;
        private static ConcurrentDictionary<string, Snake> _snakes = new ConcurrentDictionary<string, Snake>();

        public Broadcaster()
        {
            _hubContext = GlobalHost.ConnectionManager.GetHubContext<SlinkHub>();
            _broadcastLoop = new Timer(BroadcastPositions, null, BroadcastInterval, BroadcastInterval);
        }

        public void BroadcastPositions(object state)
        {
            var updatedClient = _snakes.Values.Where(x => x.Updated).ToList();
            if (updatedClient.Any())
            {
                _hubContext.Clients.All.UpdatePositions(updatedClient);
            }
        }
        public void UpdatePosition(Snake client)
        {
            _snakes[client.ConnectionId] = client;
        }

        internal void Register(Snake client)
        {
            if(_snakes.TryAdd(client.ConnectionId, client))
                _hubContext.Clients.AllExcept(client.ConnectionId).AddSnake(client);
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