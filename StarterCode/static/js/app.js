//Define url variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
let data = {}
//fetch JSON data and console log it
d3.json(url).then(function(result) {
    data = result;
        updateDropdown();
        console.log(data);
        
});

//initialize the dashboard at startup
function updateDropdown() {

    //select dropdownMenu with D3
    const dropdownMenu = d3.select("#selDataset");
    
    //create variable for sample names
    let names = data.names;

    // clear existing options
    dropdownMenu.html("");

    //iterate names to create options
    names.forEach(id => {
        dropdownMenu.append("option").text(id).property("value", id);
    });

    //populate with first ID
    optionChanged(names[0]);
    populateBarChart(names[0]);
}

// call updateDropdown
updateDropdown();
function populateMetadata(selectedID) {
    //add data to panel
    d3.json(url).then((data) => {
        let metadata = data.metadata;
        let value = metadata.find(result => result.id == selectedID);

        //check if value is matching
        if (value) {
            d3.select("#sample-metadata").html("");

            for (const [key, val] of Object.entries(value)) {
                console.log(key, val);
                d3.select("#sample-metadata").append("h5").text(`${key}: ${val}`);
            }
            console.log(selectedID);
        }   
            else {
            console.log(`no data found for ID: ${selectedID}`);
        }
    });
}

//create horizontal bar chart
function populateBarChart(id) {
    d3.json(url).then((data) => {
        let selecteddata = data.samples;
        let value = selecteddata.find(results => results.id === id);
        let valuedata = value;
        let otuLabels = valuedata.otu_labels;
        let otuIDs = valuedata.otu_ids;
        let sampleValues = valuedata.sample_values;
        let yticks = otuIDs.slice(0, 10).map(id => `OTU ${id}`).reverse();
        let xticks = sampleValues.slice(0, 10).reverse();
        let labels = otuLabels.slice(0, 10).reverse();

        //microbial data trace
        let trace1 = {
            x: xticks,
            y: yticks,
            type: "bar",
            text: labels,
            orientation: "h"
        };

        let layout = {
            title: `Top 10 OTUs for Individual ${id}`,
            xaxis: { title: 'Sample Values' },
            yaxis: { title: 'OTU ID' }
        };

        //create barchart
        Plotly.newPlot("bar", [trace1], layout);
    });
    console.log(id);
}

//create bubble chart with dropdown menu
function populateBubbleChart(id) {
    d3.json(url).then((data) => {
        let selecteddata = data.samples;
        let value = selecteddata.find(results => results.id === id);
        let valuedata = value;
        let otuLabels = valuedata.otu_labels;
        let otuIDs = valuedata.otu_ids;
        let sampleValues = valuedata.sample_values;

        //microbial data trace
        let trace1 = {
            x: otuIDs,
            y: sampleValues,
            mode: 'markers',
            marker: {
              size: sampleValues,
              color: otuIDs,
              colorscale: 'Viridis',
              opacity: 0.7
            },
            text: otuLabels
          };

          let layout = {
            title: `Bubble Chart for Individual ${id}`,
            xaxis: { title: 'OTU ID' },
            yaxis: { title: 'Sample Values' }
          };

          //create bubble chart
          Plotly.newPlot("bubble", [trace1], layout);
    });
    console.log(id);
}

function optionChanged(id) {
    populateMetadata(id)
    populateBarChart(id)
    populateBubbleChart(id)
    console.log(id);
};