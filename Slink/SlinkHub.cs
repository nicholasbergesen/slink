﻿using System;
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
            snake.updateCounter++;

#if debug
                //delaying client move is also an option.
                if(snakeClient.updateCounter < 0)
                    throw new Exception("Increase update frequency, changed direction multiple times without broadcasting to other clients"); 
#endif

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
    }

    public class Broadcaster
    {
        private readonly static Lazy<Broadcaster> _instance = new Lazy<Broadcaster>(() => new Broadcaster());
        private readonly TimeSpan BroadcastInterval = TimeSpan.FromMilliseconds(40); //broadcast maximum of 25 times per second
        private readonly IHubContext _hubContext;
        private readonly Timer _broadcastLoop;

        public Broadcaster()
        {
            _hubContext = GlobalHost.ConnectionManager.GetHubContext<SlinkHub>();
            _broadcastLoop = new Timer(BroadcastPositions, null, BroadcastInterval, BroadcastInterval);
        }

        public void BroadcastPositions(object state)
        {
            var remoteSnakes = Slink.Snakes.Values.ToList();
            if (remoteSnakes.Any(x => x.updateCounter > 0))
            {
                _hubContext.Clients.All.updatePositions(remoteSnakes);
            }

            foreach (var snakeClient in remoteSnakes)
                Slink.Snakes[snakeClient.connectionId].updateCounter--;
        }

        public void UpdatePosition(Snake client)
        {
            Slink.Snakes[client.connectionId] = client;
        }

        internal string Register(Snake client)
        {
            //currentSnakes must be populated before adding new client snake
            //to prevent sending the client its own snake as a remote snake.
            var currentSnakes = Slink.Snakes.ToList();
            if (Slink.Snakes.TryAdd(client.connectionId, client))
            {
                _hubContext.Clients.AllExcept(client.connectionId).addSnake(client);
                _hubContext.Clients.Client(client.connectionId).addSnakes(currentSnakes);
                return client.connectionId;
            }

            return string.Empty;
        }

        internal void RemoveSnake(string connectionId)
        {
            if(Slink.Snakes.TryRemove(connectionId, out _))
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