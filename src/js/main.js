var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    }),
    map = new L.Map('map', {layers: [osm], center: new L.LatLng(55.86531828981331, 37.630534172058105), zoom: 16});

var coordinates = [
          [
            37.62821674346924,
            55.86890627080961
          ],
          [
            37.62924671173096,
            55.86871363595487
          ],
          [
            37.629804611206055,
            55.868039406438854
          ],
          [
            37.63014793395996,
            55.86736516521821
          ],
          [
            37.630276679992676,
            55.866618670213754
          ],
          [
            37.630276679992676,
            55.86594440432944
          ],
          [
            37.630534172058105,
            55.86531828981331
          ],
          [
            37.63147830963135,
            55.86510155551395
          ],
          [
            37.63212203979492,
            55.865029310478775
          ],
          [
            37.63263702392578,
            55.86469216520454
          ],
          [
            37.632508277893066,
            55.8642346062232
          ],
          [
            37.632808685302734,
            55.86387337164131
          ],
          [
            37.63345241546631,
            55.86339172030652
          ],
          [
            37.634267807006836,
            55.86329538932288
          ],
          [
            37.63465404510498,
            55.863102726639
          ],
          [
            37.63443946838379,
            55.862813730821536
          ],
          [
            37.633881568908684,
            55.86252473285406
          ],
          [
            37.634053230285645,
            55.86221164929642
          ],
          [
            37.634267807006836,
            55.861850395902216
          ],
          [
            37.63465404510498,
            55.86144097132764
          ],
          [
            37.635040283203125,
            55.86124829944651
          ]
      ];

coordinates.forEach(function(ll){
    return ll.reverse();
});

var testRiver = L.polyline(coordinates, {color: 'blue'}).addTo(map);

console.log(testRiver);
map.addLayer(testRiver);

testRiver.addTo(map);

console.log(testRiver.getLatLngs());
