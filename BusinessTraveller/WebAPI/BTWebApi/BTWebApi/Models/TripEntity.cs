using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BTWebApi.Models
{
    public class TripEntity
    {
        public DateTime Start { get; set; }

        public DateTime End { get; set; }

        public string Title { get; set; }

        public string City { get; set; }
        public string Distance { get;set; }

    }
}
