// function to show magnitude as marker size
function markSize (mag) {
    return mag * 5};

// Function to determine marker color by depth
function Color(depth){
    if (depth < 10) return "lightblue";
    else if (depth < 30) return "green";
    else if (depth < 50) return "yellow";
    else if (depth < 70) return "orange";
    else if (depth < 90) return "orangered";
    else return "red";
  }


// initial draw of map w/ center
var map = L.map('map').setView([41.25818849507228, -95.93800158156371], 3);
// draw the actual map
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};



function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  }

// Use this link to get the GeoJSON data.
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_day.geojson";
// Getting our GeoJSON data
d3.json(link).then(function(data) {// Creating a GeoJSON layer with the retrieved data
    L.geoJson(data, {
      onEachFeature: onEachFeature,
      
      pointToLayer: function (feature, latlng) {
        var mark = {
            radius: markSize(feature.properties.mag),
            fillColor: Color(feature.geometry.coordinates[2]),
            fillOpacity: 0.7,
            color: "black",
            stroke: true,
            weight: 0.5
          }
          return L.circleMarker(latlng,mark)
  

          }
      })
     .addTo(map);

     var legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend"),
    depth = [-10, 10, 30, 50, 70, 90];

    div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"

    for (var i = 0; i < depth.length; i++) {
      div.innerHTML +=
      '<i style="background:' + Color(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    return div;
  };
  legend.addTo(Map)
  });