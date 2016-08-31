var elements = [];
var slot1 = '';
var slot2 = '';

var nColor;
var nComposition;

var elementEdit;

function Element(name,color,composition){
    this.name = name;
    this.color = color;
    this.composition = composition;
}

function init(){
    console.log(localStorage.elements);

    if(localStorage.elements){
        elements = JSON.parse(localStorage.elements);
        reloadInventory();
    }
    else{
        readFromJson();
        helpDialog(true);
    }


    $('#slot1').css('border','3px solid white');

    $('div#inventory').on('click','div.element',function(){
        //console.log($(this));
        if(!slot1){ //if slot1 is not filled
            $(this).clone().appendTo($('div#slot1'));
            slot1 = getElementByName($(this).text());
            $('div#slot1').css('border','none');
        }
        else if(!slot2){ //if slot2 is not filled
            $(this).clone().appendTo($('div#slot2'));
            slot2 = getElementByName($(this).text());
            $('div#slot2').css('border','none');
        }

        //console.log($(this).text());

        //console.log(slot1);
        //console.log(slot2);

        if(!slot1){
            $('div#slot1').css('border','3px solid white');
        }
        else if(!slot2){
            $('div#slot2').css('border','3px solid white');
        }
        else{
            //console.log('ready to mix');

            var comp1 = slot1.composition.split('-');
            var comp2 = slot2.composition.split('-');
            //comp1 = comp1.composition.split('-');
            //comp2 = comp2.composition.split('-');
            var compResult = [];

            //console.log(comp1);
            //console.log(comp2);

            for(i = 0; i < 5; i++){
                compResult[i] = parseInt(comp1[i]) + parseInt(comp2[i]);
            }

            compResult = compResult.join('-');

            //console.log(compResult);

            if(getElementByComposition(compResult)){ //if element exists
                //console.log('element found');
                var elementName = getElementByComposition(compResult).name;
                //console.log(elementName);
                var foundElement = $('div#inventory div.element[data-name="'+elementName+'"]');
                //console.log(foundElement);
                foundElement.clone().appendTo($('div#result'));
            }
            else{ //else create this new element
                var color1 = slot1.color.split('-');
                var color2 = slot2.color.split('-');
                for(i = 0; i < color1.length; i++){
                    color1[i] = parseInt(color1[i]);
                    color2[i] = parseInt(color2[i]);
                }
                //console.log(color1);
                //console.log(color2);
                var newcolor = [Math.floor((color1[0]+color2[0])/2),Math.floor((color1[1]+color2[1])/2),Math.floor((color1[2]+color2[2])/2)];
                //console.log(newcolor);
                newElementDialog(true);
                var element = $('<div class="element">???</div>');
                element.css('background-color','rgb('+newcolor[0]+','+newcolor[1]+','+newcolor[2]+')');
                if(newcolor[0] + newcolor[1] + newcolor[2] < 382.5){
                    element.css('color','white');
                }

                nColor = newcolor.join('-');
                nComposition = compResult;

                $('div#result').append(element);

                //$('div#new-element-dialog div.slot').html = element;
            }

        }
    });
    
    $('div#inventory').on('contextmenu','div.element',function(e){
        e.preventDefault();
        elementEdit = $(this).attr('data-name');
        //console.log($('div#element-info').css('padding'));
        if($('div#element-info').css('padding') == '0px'){
            elementInfo(true);
        }
        $('div#element-info div#elementI').html($(this).clone());
        $('div#element-info input').val($(this).text());
        var composition = getElementByName($(this).text()).composition;
        composition = composition.split('-');
        //console.log(composition);
        var sum = 0;
        $('tr#composition').children().remove();
        composition.forEach(function(c){
            var comp = $('<td>'+c+'</td>');
            $('tr#composition').append(comp);
            sum += parseInt(c);
        });
        if(sum <= 1) $('div#element-info input').prop('disabled',true);
        else $('div#element-info input').prop('disabled',false);
        $('div#element-info p#alert').css('display','none');
    });

    $('div.slot').on('click','div.element',function(){
        var slotNumber = $(this).parent().attr('id');
        //console.log(slotNumber);
        if(slotNumber === 'slot1'){
            slot1 = '';
        }
        else if(slotNumber === 'slot2'){
            slot2 = '';
        }

        if(!slot1){
            $('div#slot1').css('border','3px solid white');
            $('div#slot2').css('border','none');
        }
        else if(!slot2){
            $('div#slot1').css('border','none');
            $('div#slot2').css('border','3px solid white');
        }
        $('div#new-element-dialog input').val('');
        $('div#result').children().remove();
        newElementDialog(false);
        $(this).remove();
    });

    $('#confirm').click(function(){
        confirmElement();
    });

    $('div#new-element-dialog input').on('input',function(){
        $('div#new-element-dialog div#result div.element').text($('div#new-element-dialog input').val());
    });
    
    $('div#element-info input').on('input',function(){
        console.log(elementEdit);
        $('div#element-info div#elementI div.element').text($('div#element-info input').val());
        $('div#inventory div.element[data-name="'+elementEdit+'"]').text($('div#element-info input').val());
        $('div#inventory div.element[data-name="'+elementEdit+'"]').attr('data-name',$('div#element-info input').val());
        getElementByName(elementEdit).name = $('div#element-info input').val();
        elementEdit = $('div#element-info input').val();
        localStorage.elements = JSON.stringify(elements);
    });
    
    $('div#element-info input').click(function(){
        if($(this).prop('disabled') == true) $('div#element-info p#alert').css('display','block');
        //console.log('hi');
    });
    
    $('div#element-info span.close').click(function(){
        elementInfo(false);
    });
    
    $('div#help-box span.close').click(function(){
        helpDialog(false);
    });

    $('div#new-element-dialog input').keyup(function(e){
        //console.log(e.keyCode);
        if(e.keyCode === 13){
            confirmElement();
        }
    });

    $('#reset').click(function(){
        localStorage.elements = '';
        $('div#kitchen div.slot').children().remove();
        $('div#result').children().remove();
        slot1 = '';
        slot2 = '';
        $('div#new-element-dialog input').val('');
        newElementDialog(false);
        $('div#slot1').css('border','3px solid white');
        $('div#slot2').css('border','none');
        readFromJson();
    });
    
    $('#help').click(function(){
        helpDialog(true);
    });

    //console.log('hi');
}

function helpDialog(open){
    if(open){
        $('div#help-box').animate({
            /*margin:'1em auto',*/
            padding:'1em',
            margin:'1em',
            maxHeight:'200px',
            width:'260px',
            opacity:1
        },500,'easeOutQuart');
    }
    else{
        $('div#help-box').animate({
            /*margin:'0px auto',*/
            padding:'0px',
            margin:'0',
            maxHeight:'0px',
            width:'0px',
            opacity:0
        },500,'easeOutQuart');
    }
}

function newElementDialog(open){
    if(open){
        $('div#new-element-dialog').animate({
            /*margin:'1em auto',*/
            padding:'1em',
            margin:'1em',
            maxHeight:'165px',
            width:'260px',
            opacity:1
        },500,'easeOutQuart');
        $('div#new-element-dialog input').focus();
    }
    else{
        $('div#new-element-dialog').animate({
            /*margin:'0px auto',*/
            padding:'0px',
            margin:'0',
            maxHeight:'0px',
            width:'0px',
            opacity:0
        },500,'easeOutQuart');
    }
}

function elementInfo(open){
    if(open){
        $('div#element-info').animate({
            /*margin:'1em auto',*/
            padding:'1em',
            margin:'1em',
            maxHeight:'250px',
            width:'260px',
            opacity:1
        },500,'easeOutQuart');
    }
    else{
        $('div#element-info').animate({
            /*margin:'0px auto',*/
            padding:'0px',
            margin:'0',
            maxHeight:'0px',
            width:'0px',
            opacity:0
        },500,'easeOutQuart');
    }
}

function confirmElement(){
    if($('div#new-element-dialog input').val()){
        console.log($('div#new-element-dialog input').val());
        var newElement = new Element($('div#new-element-dialog input').val(),nColor,nComposition);
        newElementDialog(false);
        //$('div#result div.element').text = newElement.name;
        //$('div#result div.element').appendTo($('div#inventory'));
        elements.push(newElement);
        localStorage.elements = JSON.stringify(elements);

        reloadInventory();
        console.log(elements);

        $('div#kitchen div.slot').children().remove();
        $('div#result').children().remove();
        slot1 = '';
        slot2 = '';
        $('div#new-element-dialog input').val('');
    }
}

function readFromJson(){
    $.ajax({
        dataType:"json",
      url: "data/elements.json",
      success: function(data){
         elements = data;
          console.log(elements);
          reloadInventory();
      }
    });
}

function reloadInventory(){
    var starting = $('div#inventory div.element').length;
    var ending = elements.length;
    var delay = 0;
    console.log(starting + ' to ' + ending);
    if(starting > ending) $('div#inventory').children().remove();
    elements.forEach(function(e,i){
        if((i >= starting && i < ending) || starting > ending){
            var element = $('<div class="element" data-name="'+e.name+'">'+e.name+'</div>');
            var rgb = e.color.split('-');
            if(e.color === '255-255-255'){
                element.css('border','1px solid black');
            }
            element.css('background-color','rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')');
            if(parseInt(rgb[0])+parseInt(rgb[1])+parseInt(rgb[2]) < 382.5){
                element.css('color','white');
            }
            
            //$('div#inventory').append(element);
            /*element.css('opacity',0);
            element.css('transform','scale(0)');
            $('div#inventory').append(element);
            var scale = buffer;
            function scaling(){
                scale += 0.2;
                element.css('transform','scale('+scale+')');
                element.css('opacity',scale);
                if(scale >= 1) clearInterval(animation);
            }
            var animation = setInterval(scaling,32);
            buffer-=0.2;*/
            
            element.css('max-width','0px');
            element.css('max-height','0px');
            element.css('padding','0px');
            element.css('opacity',0);
            $('div#inventory').append(element);
            element.delay(delay).animate({
                maxWidth:'80px',
                maxHeight:'80px',
                padding:'1em 2px',
                opacity:1
            },100);
            delay+=50;
        }
    });
}

function getElementByName(name){
    var selected;
    elements.forEach(function(e){
        if(e.name === name){
            //console.log(e.id+' = '+id);
            //console.log(e);
            selected = e;
        }
    });
    return selected;
}

function getElementByComposition(composition){
    var selected;
    elements.forEach(function(e){
        if(e.composition === composition){
            selected = e;
        }
    });
    return selected;
}

function getCompositionByName(name){
    var selected;
    elements.forEach(function(e){
        if(e.name === name){
            selected = e.composition;
        }
    });
    return selected;
}

window.onload = init;