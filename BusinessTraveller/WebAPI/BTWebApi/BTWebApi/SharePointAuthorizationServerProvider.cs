using Microsoft.Owin.Security.OAuth;
using Microsoft.SharePoint.Client;
using System;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BTWebApi
{
    public class SharePointAuthorizationServerProvider : OAuthAuthorizationServerProvider
    {


        public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            context.Validated();
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] { "*" });
            // SharePoint...
            using (ClientContext ctx = new ClientContext(Constants.SPURL))
            {
                ctx.Credentials = new NetworkCredential(context.UserName, context.Password);
                var u = ctx.Web.CurrentUser;
                ctx.Load(u, _ => _.Title);
                try
                {
                    ctx.ExecuteQuery();
                    var identity = new ClaimsIdentity(context.Options.AuthenticationType);
                    identity.AddClaim(new Claim("user", u.Title));
                    identity.AddClaim(new Claim("login", EncryptionHelper.Encrypt(context.UserName)));
                    identity.AddClaim(new Claim("pw", EncryptionHelper.Encrypt(context.Password)));
                    context.Validated(identity);
                }
                catch (Exception ex)
                {
                   
                    context.SetError("invalid_grant", "Invalid UserName or Password");
                }
            }
        }
    }
}