$.getJSON('https://s3.console.aws.amazon.com/s3/object/healthyhelper?region=us-east-1&prefix=nutrition.json', function(data) {
    // JSON result in `data` variable
    const labelMap = data
});

var lastFruit = 'none'
export const currentFruit = (boxes, classes, scores, threshold, imgWidth, imgHeight, ctx)=>{
    for(let i = 0; i <=boxes.length; i++){
        if(boxes[i] && classes[i] && scores[i]>threshold){
            const[y,x,height,width] = boxes[i]
            const text = classes[i]

            ctx.strokeStyle = labelMap[text]['color']
            ctx.linewidth = 10
            ctx.fillStyle = 'white'
            ctx.font = '50px Arial'

            ctx.fillText(labelMap[text]['name'], 20, 50)
            ctx.font = '25px Arial'
            ctx.fillText("Calories: " + labelMap[text]['calories'], 20, 85);
            ctx.fillText("Fat: " + labelMap[text]['fat'], 20, 120);
            ctx.fillText("Cholesterol: " + labelMap[text]['cholesterol'], 20, 155);
            ctx.fillText("Sodium: " + labelMap[text]['sodium'], 20, 190);
            ctx.fillText("Potassium: " + labelMap[text]['potassium'], 20, 225);
            ctx.fillText("Carbs: " + labelMap[text]['carbs'], 20, 260);
            ctx.fillText("Protein: " + labelMap[text]['protein'], 20, 295);
        }
    }
}