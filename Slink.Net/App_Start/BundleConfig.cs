using System.Web;
using System.Web.Optimization;

namespace Slink.Net
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/js").Include(
                        "~/Scripts/slink.js"));

            bundles.Add(new StyleBundle("~/css").Include(
                      "~/Content/site.css"));

            BundleTable.EnableOptimizations = true;
        }
    }
}
