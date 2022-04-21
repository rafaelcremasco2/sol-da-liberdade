//An example progress function - just a console log in this case
function progress(x, total)
{				
    var p1 = parseInt(100 / total * x);
    var p2 = p1 + 1;
    $("#loadingBar").css("background","linear-gradient(90deg, #3498db " + p1 + "%, #FFF " + p2 + "%)");				
}

//An example completion function
function complete()
{
    //Could put something in here to do after load (this replaces the default action)
    
    //This would do the same as the default function if it's wanted as well
    //$(".loadingContent").fadeOut(200, function(){$(".loadedContent").fadeIn(200);});						
    $(".loadingContent").remove();					
    $(".toLoad").remove();					
}


//jQuery call to the module	 
$(".toLoad").preload({loadingClass: 'loadingContent',	// Class of elements to show while loading
    loadedClass: 'loadedContent',	                    // Class of elements to show once loaded
    progressFunction: progress,		                    // Optional function to call per element loaded (passing in index,totalCount)
    onComplete: complete                              // Optional function to call once all are loaded
});