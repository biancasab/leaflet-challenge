// Create the initial map object using coordinates of the USA
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4,
});

// Add tile layer to my map:
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


// Add a function to determine  marker size based on earthquake magnitude
function markerSize(magnitude) {
    return magnitude * 3;
}

// Add a function to determine marker color based on earthquake depth
function getColor(depth) {
    if (depth > 90) {
      return "#FF0000"; 
    } else if (depth > 70) {
      return "#FF4500"; 
    } else if (depth > 50) {
      return "#FFA500";
    } else if (depth > 30) {
      return "#FFFF00"; 
    } else if (depth > 10) {
      return "#ADFF2F";
    } else {
      return "#00FF00"; 
    }
  }

// Retrieve the earthquake data. I chose all earthquakes in the past 7 days
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(url).then(function(response){
    console.log(response);
    L.geoJson(response, {
        // Create a circle marker for each earthquake
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, {
            radius: markerSize(feature.properties.mag),
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
          }).bindPopup(feature.properties.place + "<hr><p>Magnitude: " + feature.properties.mag +
            "<br>Depth: " + feature.geometry.coordinates[2] + "</p>");
        },
}).addTo(myMap);

  // Create a legend
  let legend = L.control({ position: "bottomright" });

  legend.onAdd = function (map) {
    let div = L.DomUtil.create("div", "info legend");
    let depths = [-10, 10, 30, 50, 70, 90];

    div.innerHTML += "<h4>Depth</h4>";

    for (var i = 0; i < depths.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
        depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
    }

    return div;
  };

  legend.addTo(myMap);

});