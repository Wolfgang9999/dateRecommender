const express = require("express")
const app = express()
var axios = require("axios").default;
let { filters } = require("./filters")

app.use(express.json())
function matchTags(likes) {

    return filters.then((filters) => {
        // console.log(filters)
        let requiredFilters = []
        for (let idx in filters) {
            let name = idx
            let obj = filters[idx]
            // console.log(obj)
            let tags = ""
            for (let like of likes) {
                if (obj[like.toLowerCase()]) {
                    tags = tags + obj[like.toLowerCase()].toString()
                    tags = tags + ","
                } else {
                    let splitted = like.toLowerCase().split(" ");
                    for (let split of splitted) {
                        if (obj[split]) {
                            tags = tags + obj[like.toLowerCase()].toString()
                            tags = tag + ","
                            break
                        }
                    }
                }
            }
            requiredFilters[name] = tags
        }
        console.log(requiredFilters)
        return requiredFilters
    }).catch((err) => {
        console.log(err)
    })

}

app.post('/dateOptions', (req, res) => {
    let userData = req.body
    console.log(userData)
    // userData.likes.push("romantic")
    // userData.likes.push("hot new restaurants")
    let prom = matchTags(userData.likes)
    prom.then((myFilters) => {
        var options = {
            method: 'GET',
            url: 'https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng',
            params: {
                latitude: userData.latitude,
                longitude: userData.longitude,
                limit: '',
                currency: userData.currency,
                distance: '10',
                open_now: '',
                lunit: 'km',
                lang: 'en_US',
                restaurant_dining_options: myFilters["options"],
                restaurant_styles: myFilters["styles"],
                combined_food: myFilters["cuisine"],
                restaurant_tagcategory: myFilters["establishment"],
                restaurant_mealtype: myFilters["meal"],
                dietary_restrictions: myFilters["diet"]
            },
            headers: {
                'x-rapidapi-host': 'travel-advisor.p.rapidapi.com',
                'x-rapidapi-key': 'e65901085dmsh82f0cf463b87ddfp1491dajsn5923f5c5bad7'
            }
        };

        axios.request(options).then(function (response) {
            // console.log(response.data);

            let restaurants = response.data
            // console.log(restaurants)
            let apiResponse = []
            for (let ele of restaurants.data) {

                let name = ele.name
                if (name == undefined)
                    continue
                let address = ele["address"]
                let latitude = ele["latitude"]
                let longitude = ele["longitude"]
                let cuisine = ele["cuisine"]

                let mobileNo = ele["phone"]
                let rating = ele["rating"]
                let availableCuisine = []
                if (cuisine) {
                    try {
                        for (let dish of ele.cuisine) {
                            try {
                                availableCuisine.push(dish.name)
                            }
                            catch (err) { }
                        }
                    }
                    catch (e) { }
                }
                let data = {
                    name: name,
                    address: address,
                    latitude: latitude,
                    longitude: longitude,
                    phone: mobileNo
                }
                if (rating)
                    data["rating"] = rating
                if (availableCuisine.length)
                    data["preferences"] = availableCuisine
                apiResponse.push(data)

            }
            console.log(apiResponse)
            res.send({ apiResponse })

        }).catch(function (error) {
            console.error(error);
            res.send({
                "error": error
            })
        });
    }).catch((err) =>
        console.log(err)
    )

})

app.get("/", (req, res) => {
    console.log("A request on home page");

    res.send("This is a page");
});
app.listen("3000", () => {
    console.log("This is port 3000 !!!");
});
