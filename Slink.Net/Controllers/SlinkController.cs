using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;

namespace Slink.Net.Controllers
{
    public class SlinkController : ApiController
    {
        static SlinkController()
        {
            Task.Run(ClearOldClients);
        }

        private static ConcurrentDictionary<Guid, Client> _clients = new ConcurrentDictionary<Guid, Client>();

        [HttpPost]
        public void UpdatePositions(Guid clientId, List<Position> positions)
        {
            if (_clients.TryGetValue(clientId, out Client client))
                client.UpdatePoition(positions);
        }

        [HttpPost]
        public Client Register(string clientName)
        {
            var newclient = new Client(clientName);
            if (_clients.TryAdd(newclient.Id, newclient))
                return newclient;
            else
                throw new Exception("Client already on server");
        }

        [HttpGet]
        public IEnumerable<Client> GetAllPlayers(Guid playerId)
        {
            return _clients.Where(x => x.Key != playerId).Select(x => x.Value);
        }

        private const string key = "please";
        [HttpGet]
        public void Clear(string code)
        {
            if (code == key)
                _clients.Clear();
        }

        [HttpGet]
        public void Stop(string code)
        {
            if (code == key)
                _running = false;
        }

        [HttpGet]
        public void Start(string code)
        {
            if (code == key)
            {
                _running = true;
                if (_stopped)
                    Task.Run(ClearOldClients);
            }
        }

        private static bool _running = true;
        private static bool _stopped = false;
        private static async Task ClearOldClients()
        {
            while (_running)
            {
                await Task.Delay(5000);

                var now = DateTime.Now;
                var oldClientIds = _clients.Values.Where(x => now.Subtract(x.LastActivity).TotalSeconds > 5);
                foreach (var client in oldClientIds)
                    _clients.TryRemove(client.Id, out _);

                if (_clients.IsEmpty)
                    await Task.Delay(10000);
            }
            _stopped = true;
        }
    }

    [Serializable]
    public class Client
    {
        public Client(string name)
        {
            Name = name;
            Id = Guid.NewGuid();
            Created = DateTime.Now;
            LastActivity = Created;
        }

        public readonly Guid Id;
        public readonly DateTime Created;
        public DateTime LastActivity;

        public string Name { get; set; }
        public List<Position> Positions { get; private set; }

        public void UpdatePoition(List<Position> positions)
        {
            LastActivity = DateTime.Now;
            Positions = positions;
        }
    }

    [Serializable]
    public struct Position
    {
        public Position(int x, int y)
        {
            X = x;
            Y = x;
        }

        public int X { get; set; }
        public int Y { get; set; }
    }
}
