let canOnePointMove = false
let onePoint = {
    x: 0,
    y: 0
}
// 双指
let twoPoint = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0
}
export default {
    touchstart: function (e) {
        if (e.touches.length < 2) {
            canOnePointMove = true
            onePoint.x = e.touches[0].pageX * 2
            onePoint.y = e.touches[0].pageY * 2
        } else {
            twoPoint.x1 = e.touches[0].pageX * 2
            twoPoint.y1 = e.touches[0].pageY * 2
            twoPoint.x2 = e.touches[1].pageX * 2
            twoPoint.y2 = e.touches[1].pageY * 2
        }
    },
    touchmove: function (e, oldData) {
        if (e.touches.length < 2 && canOnePointMove) {
            const onePointDiffX = e.touches[0].pageX * 2 - onePoint.x
            const onePointDiffY = e.touches[0].pageY * 2 - onePoint.y
            const imgSetData = {
                msg: '单点移动',
                left: oldData.left + onePointDiffX / 2,
                top: oldData.top + onePointDiffY / 2
            }
            onePoint.x = e.touches[0].pageX * 2
            onePoint.y = e.touches[0].pageY * 2
            return imgSetData
        } else if (e.touches.length > 1) {
            const preTwoPoint = JSON.parse(JSON.stringify(twoPoint))
            twoPoint.x1 = e.touches[0].pageX * 2
            twoPoint.y1 = e.touches[0].pageY * 2
            twoPoint.x2 = e.touches[1].pageX * 2
            twoPoint.y2 = e.touches[1].pageY * 2
            // 计算角度，旋转(优先)
            const perAngle = Math.atan((preTwoPoint.y1 - preTwoPoint.y2) / (preTwoPoint.x1 - preTwoPoint.x2)) * 180 / Math.PI
            const curAngle = Math.atan((twoPoint.y1 - twoPoint.y2) / (twoPoint.x1 - twoPoint.x2)) * 180 / Math.PI
            if (Math.abs(perAngle - curAngle) > 1) {
                // 旋转
            } else {
                // 计算距离，缩放
                var preDistance = Math.sqrt(Math.pow((preTwoPoint.x1 - preTwoPoint.x2), 2) + Math.pow((preTwoPoint.y1 - preTwoPoint.y2), 2))
                var curDistance = Math.sqrt(Math.pow((twoPoint.x1 - twoPoint.x2), 2) + Math.pow((twoPoint.y1 - twoPoint.y2), 2))
                const imgSetData = {
                    msg: '缩放',
                    scale: Math.max(oldData.scale + (curDistance - preDistance) * 0.005, 0.5)
                }
                return imgSetData
            }
        }
    },
    touchend: function (e) {
        canOnePointMove = false
    },
}
