using Microsoft.SharePoint.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading;
using System.Web;

namespace BTWebApi
{
    public class SharePointContextHelper
    {
        public static ClientContext GetClientContextForCurrentPrincipal()
        {
            var identity = (ClaimsPrincipal)Thread.CurrentPrincipal;
            var claims = identity.Claims;
            var login = EncryptionHelper.Decrypt(claims.FirstOrDefault(c => c.Type == "login").Value);
            var pw = EncryptionHelper.Decrypt(claims.FirstOrDefault(c => c.Type == "pw").Value);

            ClientContext ctx = new ClientContext(Constants.SPURL);
            ctx.Credentials = new NetworkCredential(login, pw);
            return ctx;

        }
    }
}