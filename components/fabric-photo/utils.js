
/**
 * 判断点是否在多边形内部
 * @param {object} point 点坐标
 * @param {object} points 多边形坐标组
 * @param {number} angle 多边形中心点旋转角度
 * @returns
 */
export function isInPolygon(point, points, angle = 0) {
    const center = getPolygonCenterPoint(points)
    const newPoints = points.map((p) => rotatePoint(p, center, angle))

    const n = newPoints.length
    let nCross = 0
    for (let i = 0; i < n; i++) {
        const p1 = newPoints[i]
        const p2 = newPoints[(i + 1) % n]
        if (p1.y === p2.y) continue
        if (point.y < Math.min(p1.y, p2.y)) continue
        if (point.y >= Math.max(p1.y, p2.y)) continue
        const x = ((point.y - p1.y) * (p2.x - p1.x)) / (p2.y - p1.y) + p1.x
        if (x > point.x) nCross++
    }
    return nCross % 2 === 1
}

/** 点p1围绕点p2逆时针旋转angle度数后的坐标 */
function rotatePoint(p1, p2, angle) {
    const radians = (angle * Math.PI) / 180
    const dx = p1.x - p2.x
    const dy = p1.y - p2.y
    const cosRadians = Math.cos(radians)
    const sinRadians = Math.sin(radians)
    const x3 = cosRadians * dx - sinRadians * dy + p2.x
    const y3 = sinRadians * dx + cosRadians * dy + p2.y
    return { x: x3, y: y3 }
}

/**
 * 判断点是否在圆形半径内
 * @param {Point} point 点
 * @param {Point} center 圆心
 * @param {number} radius 圆半径
 */
export function isInCircle(point, center, radius) {
    const dx = point.x - center.x
    const dy = point.y - center.y
    return dx * dx + dy * dy <= radius * radius
}

/**
 * 获取多边形中心点坐标
 * @param {array} points 多边形点坐标
 * @returns 2触摸点距离
 */
export function getPolygonCenterPoint(points) {
    const result = { x: 0, y: 0 }
    points.forEach((p) => {
        result.x += p.x
        result.y += p.y
    })
    result.x /= points.length
    result.y /= points.length
    return result
}

/**
 * 获取2触摸点距离
 * @param {object} e 触摸对象
 * @returns 2触摸点距离
 */
export function get2PointsDistance(e) {
    if (e.touches.length < 2) return 0
    const xMove = e.touches[1].x - e.touches[0].x
    const yMove = e.touches[1].y - e.touches[0].y
    return Math.sqrt(xMove * xMove + yMove * yMove)
}

/** 获取多边形的包围盒 */
export function getBoundingBox(points) {
    const boundingBox = {}

    // 计算最左、最右、最上和最下的坐标
    let left = points[0].x
    let right = points[0].x
    let top = points[0].y
    let bottom = points[0].y
    for (let i = 1; i < points.length; i++) {
        if (points[i].x < left) {
            left = points[i].x
        } else if (points[i].x > right) {
            right = points[i].x
        }
        if (points[i].y < top) {
            top = points[i].y
        } else if (points[i].y > bottom) {
            bottom = points[i].y
        }
    }

    boundingBox.bl = { x: left, y: bottom }
    boundingBox.br = { x: right, y: bottom }
    boundingBox.tl = { x: left, y: top }
    boundingBox.tr = { x: right, y: top }

    return boundingBox
}

/** 获取控制点坐标 */
export function getOCoords(aCoords, controlsVis, controls) {
    function getOCoord(type, p) {
        return {
            point: p,
            vis: controlsVis[type],
            radius: controls[type].radius,
            fill: controls[type].fill,
            customDraw: controls[type].customDraw,
        }
    }

    function getPoint(key) {
        switch (key) {
            case 'ml':
                return { x: aCoords.tl.x, y: aCoords.tl.y + (aCoords.bl.y - aCoords.tl.y) / 2 }
            case 'mt':
                return { x: aCoords.tl.x + (aCoords.tr.x - aCoords.tl.x) / 2, y: aCoords.tl.y }
            case 'mr':
                return { x: aCoords.tr.x, y: aCoords.tr.y + (aCoords.br.y - aCoords.tr.y) / 2 }
            case 'mb':
                return { x: aCoords.bl.x + (aCoords.br.x - aCoords.bl.x) / 2, y: aCoords.bl.y }
            case 'mtr':
                return { x: aCoords.tl.x + (aCoords.tr.x - aCoords.tl.x) / 2, y: aCoords.tl.y - 20 }
            case 'delete':
                return { x: aCoords.bl.x + (aCoords.br.x - aCoords.bl.x) / 2, y: aCoords.bl.y + 20 }
            default:
                return aCoords[key]
        }
    }

    const result = {}
    Object.keys(controls).forEach((key) => {
        result[key] = getOCoord(key, getPoint(key))
    })

    return result
}

/** 使用向量的方式来判断两个坐标是否处于相同方向 */
export function isSameDirection(p1, p2, p3, p4) {
    // 获取 p1 到 p2 的向量
    const vector1 = {
        x: p2.x - p1.x,
        y: p2.y - p1.y,
    }

    // 获取 p3 到 p4 的向量
    const vector2 = {
        x: p4.x - p3.x,
        y: p4.y - p3.y,
    }

    if (vector1.x === 0 && vector1.y === 0 && vector2.x === 0 && vector2.y === 0) return true
    if ((vector1.x === 0 && vector1.y === 0) || (vector2.x === 0 && vector2.y === 0)) return false

    return !(
        (vector1.x < 0 && vector2.x > 0) ||
        (vector1.y < 0 && vector2.y > 0) ||
        (vector1.x > 0 && vector2.x < 0) ||
        (vector1.y > 0 && vector2.y < 0)
    )
}
