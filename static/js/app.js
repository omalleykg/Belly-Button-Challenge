// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let sampleResult = metadata.filter(sampleObj => sampleObj.id == sample);
    
    let result = sampleResult[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("")

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for(key in result) {
      panel.append("h6").text(`${key.toUpperCase()}: ${result[key]}`);
    };

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples;
   

    // Filter the samples for the object with the desired sample number
    const result = samples.filter(sampleObj => sampleObj.id == sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    const sample_values = result.sample_values.slice(0, 10);
    const otuIds = result.otu_ids.slice(0, 10).map(id => `OTU ${id}`);
    const otuLabels = result.otu_labels.slice(0, 10);

    // Build a Bubble Chart
    const bubbleTrace = {
      x: result.otu_ids,
      y: result.sample_values,
      text: result.otu_labels,
      mode: 'markers',
      marker: {
        size: result.sample_values,
        color: result.otu_ids,
        colorscale: 'Earth'
      }
    };

    const bubbleData = [bubbleTrace];

    // Create the layout for the bubble chart
    const bubbleLayout = {
      title: 'OTU Bubble Chart',
      xaxis: { title: 'OTU IDs' },
      yaxis: { title: 'Sample Values' },
      hovermode: 'closest'
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
 // });

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    const barTrace = {
      x: sample_values,
      y: otuIds,
      text: otuLabels,
      type: 'bar',
      orientation: 'h'
    };

    const barData = [barTrace];

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    const barLayout = {
      title: 'Top 10 OTUs',
      xaxis: { title: 'Sample Values' },
      yaxis: { title: 'OTU IDs' }
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', barData, barLayout);
  });
}
// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((sample)=>{
      dropdown
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Get the first sample from the list
    let firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(firstSample);
    buildCharts(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
buildMetadata(newSample);
buildCharts(newSample);
}

// Initialize the dashboard
init();
