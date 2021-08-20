var axios = require("axios").default;

var options = {
    method: 'POST',
    url: 'https://travel-advisor.p.rapidapi.com/restaurant-filters/v2/list',
    params: { currency: 'USD', units: 'km', lang: 'en_US' },
    headers: {
        'content-type': 'application/json',
        'x-rapidapi-host': 'travel-advisor.p.rapidapi.com',
        'x-rapidapi-key': 'e65901085dmsh82f0cf463b87ddfp1491dajsn5923f5c5bad7'
    },
    data: {
        geoId: 293928,
        partySize: 2,
        reservationTime: '2021-07-07T20:00',
        sort: 'RELEVANCE',
        sortOrder: 'asc',
        filters: [

        ]
    }
};

let filters = axios.request(options).then(function (response) {
    // console.log(response.data);
    let myData = response.data.data.AppPresentation_queryAppListV2[0].filters.availableFilterGroups[0].filters
    let filters = {}
    for (let ele of myData) {
        let myMap = {}
        for (let it of ele.values) {
            try {
                let data = it.object.tag
                let tag = data.localizedName, tagId = data.tagId
                myMap[tag.toLowerCase()] = tagId
            }
            catch (e) { }
        }
        filters[ele.name] = myMap
    }
    // console.log(filters)
    return filters
}).catch(function (error) {
    console.error(error);
});


module.exports.filters = filters