using System.Web.Routing;

namespace Slink
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            //routes.MapPageRoute("Home", string.Empty, "~/index.html");
            routes.RouteExistingFiles = true;
        }
    }
}
