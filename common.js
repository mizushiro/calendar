VERTICALCOMMONUI = {
    init : function(){
        this.setElement();
        this.fullLayerOpen();
        this.layerOpen();
        this.dimmedLayerCloseControl();
    },
    setElement : function(){
        this.fullLayerOpenElement ='.js-button__full-layer-open';
        this.layerOpenElement = '.js-button__layer-open';
        this.dimmedLayerCloseControlElement = '.js-button__dimmed-close';
    },
    fullLayerOpen : function(){
        var button = this.fullLayerOpenElement;
        $(document).on('click',button,function(e){
            e.stopPropagation();
            e.preventDefault();
            var $this = $(this);
            var hash = $(this).attr('data-target');
            var $target = $(hash);
            EBAY.UI.COMMON.LAYER.open(hash);
            if (hash == '#box__layer-review'){
                TOURSRPUI.reviewHeightDetect();
            }else{};
            fixedViewPort(true);
            VERTICALCOMMONUI.closeBind($this,$target,true);
        });
    },
    layerOpen : function(){
        var button = this.layerOpenElement;
        $(document).on('click',button,function(e){
            e.stopPropagation();
            e.preventDefault();
            var $this = $(this);
            var hash = $(this).attr('data-target');
            var $target = $(hash);
            EBAY.UI.COMMON.LAYER.open(hash);
            VERTICALCOMMONUI.closeBind($this,$target);
        });
    },
    closeBind : function($this,$target,fixedRelease){
        var $this = $this;
        var $target = $target;
        var hash = hash;
        var fixedRelease = fixedRelease;
        $(document).on('click','.js-button__close',function(e){
            e.preventDefault();
            $target.hide();
            $this.focus();
            if(fixedRelease){fixedViewPort(false);}
        });
    },
    dimmedLayerCloseControl : function(){
        button = this.dimmedLayerCloseControlElement;
        $(document).on('click',button,function(){
            var $this = $(this);
            var $layer = $this.parents('.box__dimmed-layer');
            $layer.hide();
        });
    },
    hashLayerOpen : function(hash,$this){
        var $target = $(hash);
        $target.show().attr('tabindex',0).css('outline','none').focus();
        //fixedViewPort(true);
        this.savedHashLayerOpener = $this;
    },
    hashLayerclose : function(closelayerObj){
        var $target = $(closelayerObj);
        var $focusTarget = this.savedHashLayerOpener?this.savedHashLayerOpener:undefined;
        fixedViewPort(false);
        $target.hide();
        this.hashUrlRemove();
        if($focusTarget == undefined) return;
        setTimeout(function(){
            $focusTarget.focus();
        },50)
    }
}

$(function(){
    VERTICALCOMMONUI.init();
});