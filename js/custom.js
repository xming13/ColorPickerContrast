window.onload = function() {
  updateBackgroundColor(document.getElementById("colorBg").value);
  updateTextColor(document.getElementById("colorText").value);
  
  $('#preview-text').hallo({
    plugins: {
      'halloformat' : { formattings: { "underline" : true } }
    }
  });
  $("#inputFontSize").keyup(function(){
    $("#inputFontSize").blur();
    $("#inputFontSize").focus();
  });

  $("#inputFontSize").keydown(function(event){
    var inputSize = $("#inputFontSize").val();
    if (isPositiveInteger(inputSize)) {
      if (event.which == 38) {
        inputSize++;
        $("#inputFontSize").val(inputSize);
        $("#inputFontSize").change();
      }
      if (event.which == 40) {
        if (inputSize > 1) {
          inputSize--;
          $("#inputFontSize").val(inputSize);
          $("#inputFontSize").change();
        }
      }
    }
  });

  $("#inputFontSize").change(function(){
    if ( isPositiveInteger($("#inputFontSize").val())) {
      $("#preview-text").css('font-size', $("#inputFontSize").val() +'px');
    }
  });

  var isFirstClicked = true;
  $("#preview-text").click(function() {
    if (isFirstClicked) {
      $("#preview-text").html("");
      isFirstClicked = false;
    }
  })
};

function updateBackgroundColor(color) {
  document.getElementById('preview-text').style.backgroundColor = '#' + color;
  checkContrast();      
}

function updateTextColor(color) {
  document.getElementById('preview-text').style.color = '#' + color;
  checkContrast();  
}

function convertToBigRGB(val) {
  if (val <= 0.03928) {
    return val / 12.92;
  }
  else {
    return Math.pow(((val + 0.055) / 1.055), 2.4);
  }
}

function getRelativeLuminance(color) {
  return 0.2126 * convertToBigRGB(color.rgb[0]) 
     + 0.7152 * convertToBigRGB(color.rgb[1])
     + 0.0722 * convertToBigRGB(color.rgb[2]);
}

function checkContrast() {
  var L1 = getRelativeLuminance(document.getElementById("colorBg").color);
  var L2 = getRelativeLuminance(document.getElementById("colorText").color);
  
  if (L2 > L1) {
    var tmp = L2;
    L2 = L1;
    L1 = tmp;
  }
  
  var ratio = ((L1 + 0.05) / (L2 + 0.05)).toFixed(2);
  $("#result-ratio").html(ratio);
  displayPassFail($("#result-aa"), ratio >= 4.5);
  displayPassFail($("#result-aa-18"), ratio >= 3.0);
  displayPassFail($("#result-aaa"), ratio >= 7.0);
  displayPassFail($("#result-aaa-18"), ratio >= 4.5);
  $("#panel-result").removeClass("panel-success")
    .removeClass("panel-warning")
    .removeClass("panel-danger")
    .addClass(ratio < 3.0 ? "panel-danger" : ( ratio < 7.0 ? "panel-warning" : "panel-success"));
}

function displayPassFail(elem, isPassed) {
  elem.html(isPassed ? "Passed" : "Failed");
  elem.parent().parent()
    .removeClass("success")
    .removeClass("danger")
    .addClass(isPassed ? "success" : "danger")
    .removeClass("text-success")
    .removeClass("text-danger")
    .addClass(isPassed ? "text-success" : "text-danger");
  $(elem.siblings()[0])
    .removeClass("glyphicon-ok")
    .removeClass("glyphicon-remove")
    .addClass("glyphicon")
    .addClass(isPassed ? "glyphicon-ok" : "glyphicon-remove");
}

function isPositiveInteger(n) {
  return /^\+?[1-9]\d*$/.test(n);
}
