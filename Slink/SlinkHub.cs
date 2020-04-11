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

        public void UpdatePosition(ClientInfo client)
        {
            client.ConnectionId = Context.ConnectionId;
            client.Updated = true;
            _broadcaster.UpdatePosition(client);
        }

        public void Register(ClientInfo newclient)
        {
            newclient.ConnectionId = Context.ConnectionId;
            _broadcaster.Register(newclient);
        }
    }

    public class Position
    {
        [JsonProperty("X")]
        public double X { get; set; }

        [JsonProperty("Y")]
        public double Y { get; set; }
    }

    public class ClientInfo
    {
        [JsonProperty("position")]
        public Position Position { get; set; }

        [JsonProperty("clientName")]
        public string ClientName { get; set; }

        [JsonProperty("isAccelerating")]
        public bool IsAccelerating { get; set; }

        [JsonIgnore]
        public bool Updated { get; set; }

        [JsonIgnore]
        public string ConnectionId { get; set; }
    }

    public class Broadcaster
    {
        private readonly static Lazy<Broadcaster> _instance = new Lazy<Broadcaster>(() => new Broadcaster());
        private readonly TimeSpan BroadcastInterval = TimeSpan.FromMilliseconds(40); //broadcast maximum of 25 times per second
        private readonly IHubContext _hubContext;
        private readonly Timer _broadcastLoop;
        private static ConcurrentDictionary<string, ClientInfo> _clients = new ConcurrentDictionary<string, ClientInfo>();

        public Broadcaster()
        {
            _hubContext = GlobalHost.ConnectionManager.GetHubContext<SlinkHub>();
            _broadcastLoop = new Timer(UpdatePositions, null, BroadcastInterval, BroadcastInterval);
        }

        public void UpdatePositions(object state)
        {
            var updatedClient = _clients.Values.Where(x => x.Updated).ToList();
            if (updatedClient.Any())
            {
                _hubContext.Clients.All.UpdatePositions(updatedClient);
            }
        }
        public void UpdatePosition(ClientInfo client)
        {
            _clients[client.ConnectionId] = client;
        }

        internal void Register(ClientInfo client)
        {
            if(_clients.TryAdd(client.ConnectionId, client))
                _hubContext.Clients.AllExcept(client.ConnectionId).AddClient(client);
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