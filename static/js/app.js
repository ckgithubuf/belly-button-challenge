// Build the metadata panel
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"
function buildMetadata(sample) {
  d3.json(url).then((data) => {

    // get the metadata field
   let metadata = data.metadata;
    // Filter the metadata for the object with the desired sample number
    filteredData = metadata.filter(data => data.id == sample)[0]
    console.log(filteredData)
    console.log(filteredData.id)

    // Use d3 to select the panel with id of `#sample-metadata`
    sampleMetadata = d3.select("#sample-metadata")
    
    // Use `.html("") to clear any existing metadata
    d3.select("#sample-metadata").html("")

    let labels = Object.keys(filteredData);
    let values = Object.values(filteredData);
    console.log(labels)
    for (let i = 0; i < labels.length; i++) {
      sampleMetadata.append("div").text(`${labels[i].toUpperCase()}  : ${filteredData[labels[i]]}`)  
    }
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json(url).then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    filteredData = samples.filter(data => data.id == sample)[0]

    // Get the otu_ids, otu_labels, and sample_values
    otuIds = filteredData["otu_ids"]
    otuLabels = filteredData["otu_labels"]
    sampledValues = filteredData["sample_values"]

    // Build a Bubble Chart
    let trace0 = {
      x: otuIds,
      y: sampledValues,
      type: "scatter",
      text: otuLabels,
      mode: 'markers',
      marker: {
          size: sampledValues,
          color: otuIds,
          colorscale: 'Viridis'
      },
    };

    // Render the Bubble Chart
    let bubble_data = [trace0];

    // Apply a title to the layout
    let bubble_layout = {
      title: "Bacteria cultures per sample",
      showlegend: false,
      height: 600,
      width: 1200,
      xaxis: {
        title: 'OTU ID'
      },
      yaxis: {
        title: 'Number of Bacteria'
      }         
    };
    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bubble", bubble_data, bubble_layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let slicedOtuIds = otuIds.slice(0, 10).map(id => `OTU ${id}`);
    let slicedSampledValues = sampledValues.slice(0, 10);
    let slicedOtuLabels = otuLabels.slice(0, 10);
    slicedSampledValues.reverse()
    slicedOtuIds.reverse()
    slicedOtuLabels.reverse()

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let trace1 = {
      x: slicedSampledValues,
      y: slicedOtuIds,
      name: "OTU data",
      type: "bar",
      orientation: "h",
      text: slicedOtuLabels
    };

    // Data array
  let bar_data = [trace1];

  // Apply a title to the layout
  let layout = {
    title: "Top 10 Bacteria cultures found",
    margin: {
      l: 100,
      r: 100,
      t: 100,
      b: 100
    },
    xaxis: {
      title: 'Number of Bacteria'
    }   
  };
  // Render the plot to the div tag with id "plot"
  Plotly.newPlot("bar", bar_data, layout);
  });
}

// Function to run on page load
function init() {
  d3.json(url).then((data) => {
    
    // Get the names field
    let names = data.names

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownMenu = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let n = 0; n < names.length; n++) {
      d3.select("#selDataset").append("option").text(names[n]);
    }

    // Get the first sample from the list
    firstSample = names[0]

    // Build charts and metadata panel with the first sample
    buildMetadata(firstSample)
    buildCharts(firstSample)
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample)
  buildCharts(newSample)
}

// Initialize the dashboard
init();
