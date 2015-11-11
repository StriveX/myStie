from numpy import *
import loadData

def testData():
    return [[1,1,1],[1.1,1.1,1.1],
            [10,10,10],[11,11,11]]

def distEclud(vecA, vecB):
    return sqrt(sum(power(vecA-vecB,2)))

def randCent(data, k):
    n = shape(data)[1]
    center = mat(zeros((k,n)))
    for i in range(n): # for each dimension
        minI = min(data[:,i])
        rangeI = float(max(data[:,i] - minI))
        center[:,i] = mat(minI + rangeI * random.rand(k,1))
    return center
        
# add assert to check if k < shape(data)[0]
def kMeans(data, k, distFunc=distEclud, centCreateFunc=randCent):
    m = shape(data)[0]
    cluster = mat(zeros((m,2))) # hold the info (cluster, sse) for each point
    center = centCreateFunc(data, k)
    clusterChanged = True
    while clusterChanged:
        clusterChanged = False
        for i in range(m):
            minDist = inf
            minIndex = -1
            for j in range(k):
                tempDist = distFunc(data[i,:],center[j,:])
                if tempDist < minDist:
                    minDist = tempDist
                    minIndex = j
            if (minIndex != cluster[i:0]): clusterChanged = True
            cluster[i,:] = minIndex, minDist**2
        #print center
        for cent in range(k):
            pointInCluster = data[nonzero(cluster[:,0].A==cent)[0]] # the column in data, whose first info (cluster) is current cluster(cluster[:,0].A==cent)
                                                                    # nonzero()[0] gives the column number of them
            center[cent,:] = mean(pointInCluster, axis=0)            # axis=0, sum over column
    return center, cluster
    
def biKMeans(data, k=2, distFunc=distEclud):
    m = shape(data)[0]
    cluster = mat(zeros((m,2)))
    center0 = mean(data, axis=0).tolist()[0]
    centers = [center0]
    for i in range(m):
        cluster[i,1] = distFunc(data[i,:],mat(center0))**2
    while (len(centers)<k):
        minSSE = inf
        for i in range(len(centers)):
            pointInCluster = data[nonzero(cluster[:,0].A==i)[0],:]
            centerMat, splitCluster = kMeans(pointInCluster, 2)
            sseSplit = sum(splitCluster[:,1])
            sseNoSplit = sum(cluster[nonzero(cluster[:,0].A!=i)[0]])
            totalSSE = sseSplit + sseNoSplit
            if (totalSSE < minSSE):
                minSSE = totalSSE
                bestCenterToSplit = i
                bestNewCenters = centerMat
                bestSplitClust = splitCluster.copy()
        bestSplitClust[nonzero(bestSplitClust[:,0].A==0)[0],0] = bestCenterToSplit
        bestSplitClust[nonzero(bestSplitClust[:,0].A==1)[0],0] = len(centers)
        centers[bestCenterToSplit] = bestNewCenters[0,:].tolist()[0]
        centers.append(bestNewCenters[1,:].tolist()[0])
        cluster[nonzero(cluster[:,0].A==bestCenterToSplit)[0],:] = bestSplitClust
    groups = []    
    for i in range(k):
        group = data[nonzero(cluster[:,0].A==i),:][0]
        groups.append(group)
    return mat(centers), cluster, groups