using BTWebApi.Models;
using Microsoft.SharePoint.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace BTWebApi.Controllers
{
    [Authorize]
    public class TripsController : ApiController
    {

        public List<TripEntity> Get()
        {
            using (var ctx = SharePointContextHelper.GetClientContextForCurrentPrincipal())
            {
                var vacationsList = ctx.Web.Lists.GetByTitle(Constants.SPLISTE);
                var items = vacationsList.GetItems(CamlQuery.CreateAllItemsQuery());
                ctx.Load(items);
                ctx.ExecuteQuery();

                var ret = new List<TripEntity>();
                items.ToList().ForEach(i => {
                    ret.Add(new TripEntity
                    {
                        Title = (i[Constants.FELD_TITLE] ?? "").ToString(),
                        City = (i[Constants.FELD_CITY] ?? "").ToString(),
                        Start = (DateTime)(i[Constants.FELD_START] ?? DateTime.MinValue),
                        End = (DateTime)(i[Constants.FELD_END] ?? DateTime.MinValue),
                        Distance = (i[Constants.FELD_DISTANCE] ??"").ToString()
                        
                    });
                });

                return ret;
            }
        }

        [HttpPost()]
        public void AddTrip([FromBody] TripEntity trip)
        {
            using (var ctx = SharePointContextHelper.GetClientContextForCurrentPrincipal())
            {
                var tripList= ctx.Web.Lists.GetByTitle(Constants.SPLISTE);
                var lici = new ListItemCreationInformation();
                var newItem = tripList.AddItem(lici);
                newItem[Constants.FELD_TITLE] = trip.Title;
                newItem[Constants.FELD_START] = trip.Start;
                newItem[Constants.FELD_END] = trip.End;
                newItem[Constants.FELD_CITY] = trip.City;
                newItem.Update();
                ctx.ExecuteQuery();
            }
        }


    }
}
