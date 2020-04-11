using Microsoft.Owin;
using Owin;

namespace Slink
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
        }
    }
}