using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Bubble : MonoBehaviour
{
    private float timePass = 0.0f;
    // Start is called before the first frame update
    void Start()
    {
        //int lifeTime = 5;
        //Destroy(this.gameObject, lifeTime);
    }

    // Update is called once per frame
    void Update()
    {
        timePass += Time.deltaTime;

        if (timePass > 2.0f)
        {
            timePass = 0.0f;
            Destroy(this.gameObject);
            Debug.Log("destroy because Timeout");
            AlgorithmController.CalcNextBubbleLoacation(false);
        }
    }

    void OnMouseDown()
    {
        // this object was clicked - do something
        Debug.Log("clicked bubble:" + transform.position);
        Destroy(this.gameObject);
        Debug.Log("destroy because Pop");
        AlgorithmController.CalcNextBubbleLoacation(true);

    }
}
