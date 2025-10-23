
import React from 'react'

const FourMulDivAdd = ({ formData, lang ,result }) => {
  return (

    <>
    
    
    
    {/* <?php if($action === '÷'){ 
        $ON2 = $N2;
        $OD2 = $D2;
        list($N2,$D2) = array($D2,$N2);
        $oaction = $action;
        $action = '×';
        $oaction1 = $action1;
        $oaction2 = $action2; ?>
        <p className="mt-2">
            So we are having three different operations in the problem given. But first, we will work on <?= $oaction ?> operation
        </p>
        <p className="mt-2"><?=$lang[26]?>.</p>
        <p className="mt-2"><?=$lang[27]?>.</p>
        <p className="text-center mt-2">
            \(
                \dfrac{<?=$N1?>}{<?=$D1?>} <?=$action?> 
                \dfrac{<?=$N2?>}{<?=$D2?>} <?=$action1?> 
                \dfrac{<?=$N3?>}{<?=$D3?>} <?=$action2?> 
                \dfrac{<?=$N4?>}{<?=$D4?>} = \ ?
            \)
        </p>
    <?php }else{
        $ON2 = $N2;
        $OD2 = $D2;
        $ON3 = $N3;
        $OD3 = $D3;
        $ON4 = $N4;
        $OD4 = $D4;
        $oaction = $action;
        $oaction1 = $action1;
        $oaction2 = $action2;
    } ?>
    <?php if($action1 === '÷'){ 
        list($N3,$D3) = array($D3,$N3);
        $action1 = '×'; ?>
        <p className="mt-2">
            So we are having three different operations in the problem given. But first, we will work on <?= $oaction1 ?> operation
        </p>
        <p className="mt-2"><?=$lang[26]?>.</p>
        <p className="mt-2"><?=$lang[27]?>.</p>
        <p className="text-center mt-2">
            \(
                \dfrac{<?=$N1?>}{<?=$D1?>} <?=$action?> 
                \dfrac{<?=$N2?>}{<?=$D2?>} <?=$action1?> 
                \dfrac{<?=$N3?>}{<?=$D3?>} <?=$action2?> 
                \dfrac{<?=$N4?>}{<?=$D4?>} = \ ?
            \)
        </p>
    <?php }?>
    <p className="mt-2"><?=$lang[28]?>.</p>
    <p className="text-center mt-2">
        \( = \dfrac{(<?=$N1?>)\times(<?=$N2?>)\times(<?=$N3?>)}{<?=$D1?>\times<?=$D2?>\times<?=$D3?>} \)
    </p>
    <p className="text-center mt-2">
        \( = \dfrac{<?=$N1*$N2*$N3?>}{<?=$D1*$D2*$D3?>} \)
    </p>
    <?php
        $N1 =  $N1*$N2*$N3;
        $D1 =  $D1*$D2*$D3;
        $N2 = $N4;
        $D2 = $D4;
    ?>
    
    <p className="mt-2">Now,</p>
    <p className="text-center mt-2">
        \(
            \dfrac{<?=$N1?>}{<?=$D1?>} <?=$action2?> 
            \dfrac{<?=$N2?>}{<?=$D2?>} = \ ?
        \)
    </p>
    
    <?php if($D1!=$D2){ ?>
        <p className="mt-2"><?=$lang[30]?>.</p>
        <?php $x = "$N1/$D1,$N2/$D2" ?>
        <p className="mt-2">
            <a href="#" className="text-blue text-decoration-none" target="_blank">LCD(<?=$x?>) = <?=$detail['lcd']?></a>
        </p>
        <p className="mt-2"><?=$lang[31]?>.</p>
        <p className="text-center mt-2">
            \( \left(\dfrac{<?=$N1?>}{<?=$D1?>} \times \dfrac{<?=$detail['lcd']/$D1?>}{<?=$detail['lcd']/$D1?>} \right) <?=$action2?> \left(\dfrac{<?=$N2?>}{<?=$D2?>} \times \dfrac{<?=$detail['lcd']/$D2?>}{<?=$detail['lcd']/$D2?>} \right) = ? \)
        </p>
        <p className="mt-2"><?=$lang[32]?>.</p>
        <p className="text-center mt-2">
            <?php $mul1 = $detail['lcd']/$D1;$mul2 = $detail['lcd']/$D2; ?>
            \( \left(\dfrac{<?=$N1*$mul1?>}{<?=$D1*$mul1?>} \right) <?=$action2?> \left(\dfrac{<?=$N2*$mul2?>}{<?=$D2*$mul2?>} \right) = ? \)
        </p>
        <p className="mt-2"><?=$lang[33]?> <?=($action2=='+')?'+':'-'?> <?=$lang[34]?>. <br> <?=$lang[35]?>:</p>
        <p className="text-center mt-2">
            <?php if($action2=='+'){ 
                    $plus = ($N1*$mul1) + ($N2*$mul2);
                }elseif($action2=='-'){
                    $plus = ($N1*$mul1) - ($N2*$mul2);
                } ?>
            \( \dfrac{<?=$N1*$mul1?> <?=$action2?> <?=$N2*$mul2?>}{<?=$D1*$mul1?>} = \dfrac{<?=$plus?>}{<?=$D1*$mul1?>} \)
        </p>
    <?php }elseif($D1==$D2){
        $mul1 = 1;
            ?>
        <p className="mt-2"><?=$lang[17]?>.<br> <?=$lang[35]?>:</p>
        <p className="text-center mt-2">
            <?php if($action2=='+'){ 
                $plus = ($N1) + ($N2);
                }elseif($action2=='-'){
                $plus = ($N1) - ($N2);
                } ?>
            \( \dfrac{<?=$N1?> <?=$action2?> <?=$N2?>}{<?=$D1?>} = \dfrac{<?=$plus?>}{<?=$D1?>} \)
        </p>
    <?php } ?>
    
    <!-- for GCF -->
    <?php if(gcd($plus,$D1*$mul1)!=1){ $gcd=gcd($plus,$D1*$mul1); ?>
        <p className="mt-2"><?=$lang[18]?> <?=$plus?> <?=$lang[12]?> <?=$D1*$mul1?> <?=$lang[19]?></p>
        <p className="mt-2">
            <a href="#" className="text-blue text-decoration-none" target="_blank">GCF(<?=$plus?>,<?=$D1*$mul1?>) = <?=$gcd?></a>
        </p>
        <p className="text-center mt-2">
            \( \dfrac{<?=$plus?> \div <?=$gcd?>}{<?=$D1*$mul1?> \div <?=$gcd?>} = \)
            <?php if($detail['btm']!=1 && $detail['upr']!=0){ ?>
                \( \dfrac{<?=$detail['upr']?>}{<?=$detail['btm']?>} \)
            <?php }else{ ?>
                \( <?=$detail['upr']?> \)
            <?php } ?>
        </p>
    <?php } ?>
    <?php if($detail['btm']!=1 && $detail['upr']!=0 && $detail['upr']>$detail['btm']){ ?>
        <p className="mt-2"><?=$lang[20]?></p>
        <p className="text-center mt-2">\( \dfrac{<?=$detail['upr']?>}{<?=$detail['btm']?>} \)</p>
        <p className="mt-2"><?=$lang[21]?></p>
        <p className="text-center mt-2">\( <?=$detail['upr']?> \div <?=$detail['btm']?> \)</p>
        <?php if($detail['upr']%$detail['btm']!=0 && $detail['upr']>$detail['btm']){ ?>
            <p className="mt-2"><?=$lang[22]?>:</p>
            <?php
                $bta=abs($detail['upr'] % $detail['btm']);
                $shi=$detail['upr'] / $detail['btm'];
                $shi = explode('.',$shi);
                $shi = $shi[0];
            ?>
            <p className="text-center mt-2">\( \dfrac{<?=$detail['upr']?>}{<?=$detail['btm']?>} = <?=$shi.' \\dfrac{'.$bta.'}{'.$detail['btm']?>} \)</p>
            <p className="mt-2"><?=$lang[23]?>:</p>
            <p className="text-center mt-2">\( \dfrac{<?=$N1?>}{<?=$D1?>} <?=$action2?> \dfrac{<?=$N2?>}{<?=$D2?>} = <?=$shi.' \\dfrac{'.$bta.'}{'.$detail['btm']?>} \)</p>
        <?php } ?>
    <?php }else{ ?>
            <p className="mt-2"><?=$lang[23]?>:</p>
            <p className="text-center mt-2">
                \( \dfrac{<?=$N1?>}{<?=$D1?>} <?=$action2?> \dfrac{<?=$N2?>}{<?=$D2?>} = \)
                <?php if($detail['btm']!=1 && $detail['upr']!=0){ ?>
                    \( \dfrac{<?=$detail['upr']?>}{<?=$detail['btm']?>} \)
                <?php }else{ ?>
                    \( <?=$detail['upr']?> \)
                <?php } ?>
            </p>
    <?php } ?> */}
    </>
   
  )
}

export default FourMulDivAdd

