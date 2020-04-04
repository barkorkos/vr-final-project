using System.Collections.Generic;
using UnityEngine;
using System.Linq;
using System;


public class AlgorithmController : MonoBehaviour
{
    // Reference to the Prefab. Drag a Prefab into this field in the Inspector.
    public GameObject myPrefab;
    public const int N = 6;
    public static int[,,] rewardsTable = new int[N, N, N];
    public static Queue<int>[,,] lastAppearance = new Queue<int>[N, N, N];
    public static int xPosition, yPosition, zPosition;
    public static Dictionary<string, Dictionary<string, double>> qTable = new Dictionary<string, Dictionary<string, double>>();
    public static double learningRate = 0.8;
    public static double discountFactor = 0.95;
    public static double randomExplore = 1;
    public static int iterationsCounter = 1;
    public const int numOfLastAppearance = 5;
    public static string[] directions = new string[6] { "UP", "DOWN", "LEFT", "RIGHT", "FORWARD", "BACKWARD" };
    public static bool testFlag =false;
// This script will simply instantiate the Prefab when the game starts.
    void Start()
    {
        //place the first bubble
        Debug.Log("BUBBLE NUMBER 1");
        xPosition = UnityEngine.Random.Range(0, N);
        Debug.Log("x: " + xPosition);
        yPosition = UnityEngine.Random.Range(0, N);
        Debug.Log("y: " + yPosition);
        zPosition = UnityEngine.Random.Range(0, N);
        Debug.Log("z: " + zPosition);
        Instantiate(myPrefab, new Vector3(xPosition, yPosition, zPosition), Quaternion.identity);


        //initialize the last 5 appearance of every cell in the space 
        InitializeLastAppearance(lastAppearance);
        InitializeQTable(qTable);

      
    }

    void Update()
    {
        if (testFlag)
        {
            testFlag = false;
            iterationsCounter++;
            Instantiate(myPrefab, new Vector3(xPosition, yPosition, zPosition), Quaternion.identity);
        }
    }

    static void InitializeLastAppearance(Queue<int>[,,] lastApperence)
    {
        for (int i = 0; i < N; i++)
        {
            for (int j = 0; j < N; j++)
            {
                for (int k = 0; k < N; k++)
                {
                    lastApperence[i, j, k] = new Queue<int>();
                    for (int g = 0; g < numOfLastAppearance; g++)
                    {
                        lastApperence[i, j, k].Enqueue(1);
                    }
                }
            }
        }
    }

    static void InitializeQTable(Dictionary<string, Dictionary<string, double>> qTable)
    {
        
        for (int i = 0; i < N; i++)
        {
            for (int j = 0; j < N; j++)
            {
                for (int k = 0; k < N; k++)
                {
                    Dictionary<string, double> subDict = new Dictionary<string, double>();
                    foreach (string direcation in directions)
                    {
                        subDict.Add(direcation, 0);
                    }
                    qTable.Add(i.ToString() + j.ToString() + k.ToString(), subDict);
                }
            }
        }
    }

    static void ChangeBubblePosition(string direction)
    {
        if (direction.Equals("UP"))
        {
            if (yPosition == N - 1)
                yPosition = 0;
            else yPosition++;
        }

        if (direction.Equals("DOWN"))
        {
            if (yPosition == 0)
                yPosition = N-1;
            else yPosition--;
        }
        
        if (direction.Equals("RIGHT"))
        {
            if (xPosition == N-1)
                xPosition = 0;
            else xPosition++;
        }

        if (direction.Equals("LEFT"))
        {
            if (xPosition == 0)
                xPosition = N - 1;
            else xPosition--;
        }

        if (direction.Equals("FORWARD"))
        {
            if (zPosition == N-1)
                zPosition = 0;
            else zPosition++;
        }

        if (direction.Equals("BACKWARD"))
        {
            if (zPosition == 0)
                zPosition = N-1;
            else zPosition--;
        }
    }

    public static void CalcNextBubbleLoacation(bool isPop)
    {

        if (iterationsCounter > 100)
        {
            Debug.Log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
            Debug.Log("AFTER 100");
            learningRate = 0.2;
            randomExplore = 0.1;
        }
        /*update details about the last apperance of the bubble*/
        string lastBubbleState = xPosition.ToString() + yPosition.ToString() + zPosition.ToString();
        Debug.Log("The bubble appeared in 'xyz': " + lastBubbleState);
        Debug.Log("The user pop the bubble: " + isPop);

        // change last appearance queue
        lastAppearance[xPosition, yPosition, zPosition].Dequeue();
        lastAppearance[xPosition, yPosition, zPosition].Enqueue(isPop ? 1 : 0);

        //calc the new reward value of the last place of the bubble
        CalcNewReward();


        /* choose what action to take and update the qtable values*/
        
        //choose action to take
        string maxeRwardAction;
        float randomNumber = UnityEngine.Random.Range(0.0f,1.0f);
        if (randomNumber < randomExplore)
        {
            Debug.Log("Agent choose randomly");
            maxeRwardAction = directions[UnityEngine.Random.Range(0, 5)];
        }
        else
        {
            Debug.Log("Agent choose smart choice");
            Dictionary<string, double> qTableColumn = qTable[lastBubbleState];
            maxeRwardAction = qTableColumn.Aggregate((l, r) => l.Value > r.Value ? l : r).Key;
        }

        //take the next move
        ChangeBubblePosition(maxeRwardAction);
        string currentState = xPosition.ToString() + yPosition.ToString() + zPosition.ToString();
        int NewReward = rewardsTable[xPosition, yPosition, zPosition];
        QFunction(learningRate, discountFactor, NewReward, currentState, lastBubbleState, maxeRwardAction);
        testFlag = true;

    }

    static void CalcNewReward()
    {
        int counter=0;
        foreach(int isPop in lastAppearance[xPosition, yPosition, zPosition]) { counter += isPop;}

        switch(counter)
        {
            case 0:
                //no change
                rewardsTable[xPosition, yPosition, zPosition] = rewardsTable[xPosition, yPosition, zPosition];
                break;
            case 1:
                rewardsTable[xPosition, yPosition, zPosition] = rewardsTable[xPosition, yPosition, zPosition]-2;
                break;
            case 2:
                rewardsTable[xPosition, yPosition, zPosition] = rewardsTable[xPosition, yPosition, zPosition]+4;
                break;
            case 3:
                rewardsTable[xPosition, yPosition, zPosition] = rewardsTable[xPosition, yPosition, zPosition]+3;
                break;
            case 4:
                //no change
                rewardsTable[xPosition, yPosition, zPosition] = rewardsTable[xPosition, yPosition, zPosition];
                break;
            case 5:
                rewardsTable[xPosition, yPosition, zPosition] = rewardsTable[xPosition, yPosition, zPosition]-2;
                break;
        }
    }
    
    static void QFunction(double learningRate, double discountFactor, int NewReward, string currentState, string lastState, string chosenAction)
    {
        double OpimtalFutureValue = qTable[currentState].Aggregate((l, r) => l.Value > r.Value ? l : r).Value;
        double DiscountedOpimtalFutureValue = OpimtalFutureValue * discountFactor;
        double LearnedValue = NewReward + DiscountedOpimtalFutureValue;
        qTable[lastState][chosenAction] = Math.Round((1 - learningRate) * qTable[lastState][chosenAction] + learningRate * LearnedValue, 3);
    }
    
}


